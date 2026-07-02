<?php

namespace App\Http\Controllers;

use App\Enums\FinancialTransactionCategory;
use App\Enums\FinancialTransactionStatus;
use App\Http\Requests\FinancialTransaction\StoreFinancialTransactionRequest;
use App\Http\Requests\FinancialTransaction\UpdateFinancialTransactionRequest;
use App\Models\FinancialTransaction;
use App\Models\Vehicle;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FinancialTransactionController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(FinancialTransaction::class, 'financial_transaction');
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'status', 'vehicle_id', 'month']);
        $month = Carbon::parse($filters['month'] ?? now()->format('Y-m-01'));
        $months = collect(CarbonPeriod::create($month->copy()->subMonths(5)->startOfMonth(), '1 month', $month->copy()->endOfMonth()))
            ->map(fn (Carbon $date) => $date->copy())
            ->values();

        $transactions = FinancialTransaction::query()
            ->with(['vehicle:id,agency_id,unit_number,plate_number', 'vehicle.agency:id,name', 'createdBy:id,name'])
            ->search($filters['search'] ?? null)
            ->category($filters['category'] ?? null)
            ->status($filters['status'] ?? null)
            ->vehicleId($filters['vehicle_id'] ?? null)
            ->latest('transaction_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('financial-transactions/index', [
            'transactions' => $transactions,
            'filters' => $filters,
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'categoryOptions' => array_map(
                fn (FinancialTransactionCategory $category) => ['value' => $category->value, 'label' => str($category->value)->headline()->toString()],
                FinancialTransactionCategory::all(),
            ),
            'statusOptions' => array_map(
                fn (FinancialTransactionStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                FinancialTransactionStatus::all(),
            ),
            'monthlySeries' => $months->map(fn (Carbon $monthPoint) => $this->monthlyPoint($monthPoint))->all(),
            'categoryBreakdown' => $this->categoryBreakdown($month),
            'summary' => $this->summary($month),
            'canCreate' => $request->user()?->can('create', FinancialTransaction::class) ?? false,
            'canManage' => $request->user()?->can('update', FinancialTransaction::class) ?? false,
        ]);
    }

    public function create(Request $request): Response
    {
        $vehicleId = $request->integer('vehicle_id');
        $vehicle = $vehicleId
            ? Vehicle::query()->with('agency:id,name')->find($vehicleId)
            : null;

        return Inertia::render('financial-transactions/create', [
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'categoryOptions' => array_map(
                fn (FinancialTransactionCategory $category) => ['value' => $category->value, 'label' => str($category->value)->headline()->toString()],
                FinancialTransactionCategory::all(),
            ),
            'statusOptions' => array_map(
                fn (FinancialTransactionStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                FinancialTransactionStatus::all(),
            ),
            'selectedVehicleId' => $vehicle?->id,
            'selectedAgencyId' => $vehicle?->agency_id,
            'selectedDate' => now()->toDateString(),
        ]);
    }

    public function store(StoreFinancialTransactionRequest $request): RedirectResponse
    {
        $transaction = DB::transaction(function () use ($request): FinancialTransaction {
            $data = $request->validated();
            $category = FinancialTransactionCategory::from($data['category']);

            return FinancialTransaction::query()->create([
                'agency_id' => $data['agency_id'],
                'vehicle_id' => $data['vehicle_id'],
                'created_by_user_id' => $request->user()?->id,
                'transaction_number' => $this->generateTransactionNumber(),
                'transaction_date' => $data['transaction_date'],
                'direction' => $category->direction(),
                'category' => $category->value,
                'status' => $data['status'],
                'amount' => $data['amount'],
                'currency' => 'USD',
                'description' => $data['description'] ?? null,
                'reference' => $data['reference'] ?? null,
            ]);
        });

        return redirect()->route('financial-transactions.show', $transaction)->with('success', 'Financial transaction created successfully.');
    }

    public function show(FinancialTransaction $financial_transaction): Response
    {
        $financial_transaction->load([
            'vehicle:id,agency_id,unit_number,plate_number,status',
            'vehicle.agency:id,name',
            'createdBy:id,name',
        ]);

        return Inertia::render('financial-transactions/show', [
            'transaction' => $financial_transaction,
            'canManage' => request()->user()?->can('update', $financial_transaction) ?? false,
        ]);
    }

    public function edit(FinancialTransaction $financial_transaction): Response
    {
        $financial_transaction->load(['vehicle:id,agency_id,unit_number,plate_number,status', 'vehicle.agency:id,name']);

        return Inertia::render('financial-transactions/edit', [
            'transaction' => $financial_transaction,
            'vehicles' => Vehicle::query()
                ->with('agency:id,name')
                ->orderBy('unit_number')
                ->get(['id', 'agency_id', 'unit_number', 'plate_number', 'status']),
            'categoryOptions' => array_map(
                fn (FinancialTransactionCategory $category) => ['value' => $category->value, 'label' => str($category->value)->headline()->toString()],
                FinancialTransactionCategory::all(),
            ),
            'statusOptions' => array_map(
                fn (FinancialTransactionStatus $status) => ['value' => $status->value, 'label' => str($status->value)->headline()->toString()],
                FinancialTransactionStatus::all(),
            ),
        ]);
    }

    public function update(UpdateFinancialTransactionRequest $request, FinancialTransaction $financial_transaction): RedirectResponse
    {
        $data = $request->validated();
        $category = FinancialTransactionCategory::from($data['category']);

        $financial_transaction->update([
            'agency_id' => $data['agency_id'],
            'vehicle_id' => $data['vehicle_id'],
            'transaction_date' => $data['transaction_date'],
            'direction' => $category->direction(),
            'category' => $category->value,
            'status' => $data['status'],
            'amount' => $data['amount'],
            'description' => $data['description'] ?? null,
            'reference' => $data['reference'] ?? null,
        ]);

        return redirect()->route('financial-transactions.show', $financial_transaction)->with('success', 'Financial transaction updated successfully.');
    }

    public function destroy(FinancialTransaction $financial_transaction): RedirectResponse
    {
        $financial_transaction->delete();

        return redirect()->route('financial-transactions.index')->with('success', 'Financial transaction deleted successfully.');
    }

    /**
     * @return array{month: string, revenue: float, expenses: float, profit: float}
     */
    private function monthlyPoint(Carbon $month): array
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        $summary = $this->summary($month);

        return [
            'month' => $month->format('M'),
            'revenue' => $summary['revenue'],
            'expenses' => $summary['expenses'],
            'profit' => $summary['profit'],
        ];
    }

    /**
     * @return array<int, array{category: string, total: float}>
     */
    private function categoryBreakdown(Carbon $month): array
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        return [
            ['category' => FinancialTransactionCategory::Revenue->value, 'total' => $this->sumByCategory($start, $end, FinancialTransactionCategory::Revenue->value)],
            ['category' => FinancialTransactionCategory::FuelCost->value, 'total' => $this->sumByCategory($start, $end, FinancialTransactionCategory::FuelCost->value)],
            ['category' => FinancialTransactionCategory::Insurance->value, 'total' => $this->sumByCategory($start, $end, FinancialTransactionCategory::Insurance->value)],
            ['category' => FinancialTransactionCategory::MaintenanceCost->value, 'total' => $this->sumByCategory($start, $end, FinancialTransactionCategory::MaintenanceCost->value)],
            ['category' => FinancialTransactionCategory::OtherExpense->value, 'total' => $this->sumByCategory($start, $end, FinancialTransactionCategory::OtherExpense->value)],
        ];
    }

    /**
     * @return array{revenue: float, expenses: float, profit: float, roi: float}
     */
    private function summary(Carbon $month): array
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        $revenue = $this->sumByCategory($start, $end, FinancialTransactionCategory::Revenue->value);
        $fuelCost = $this->sumByCategory($start, $end, FinancialTransactionCategory::FuelCost->value);
        $insurance = $this->sumByCategory($start, $end, FinancialTransactionCategory::Insurance->value);
        $maintenanceCost = $this->sumByCategory($start, $end, FinancialTransactionCategory::MaintenanceCost->value);
        $otherExpenses = $this->sumByCategory($start, $end, FinancialTransactionCategory::OtherExpense->value);
        $expenses = $fuelCost + $insurance + $maintenanceCost + $otherExpenses;
        $profit = $revenue - $expenses;

        return [
            'revenue' => round($revenue, 2),
            'expenses' => round($expenses, 2),
            'profit' => round($profit, 2),
            'roi' => $expenses > 0 ? round(($profit / $expenses) * 100, 2) : 0.0,
        ];
    }

    private function sumByCategory(Carbon $start, Carbon $end, string $category): float
    {
        return (float) FinancialTransaction::query()
            ->whereBetween('transaction_date', [$start, $end])
            ->where('status', FinancialTransactionStatus::Posted->value)
            ->where('category', $category)
            ->sum('amount');
    }

    private function generateTransactionNumber(): string
    {
        return 'FTX-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
    }
}
