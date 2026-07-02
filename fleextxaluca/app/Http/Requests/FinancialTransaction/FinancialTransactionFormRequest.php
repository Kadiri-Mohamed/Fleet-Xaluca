<?php

namespace App\Http\Requests\FinancialTransaction;

use App\Enums\FinancialTransactionCategory;
use App\Enums\FinancialTransactionStatus;
use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

abstract class FinancialTransactionFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'agency_id' => ['required', 'integer', 'exists:agencies,id'],
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'transaction_date' => ['required', 'date'],
            'category' => ['required', 'string', 'in:'.implode(',', FinancialTransactionCategory::values())],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'status' => ['required', 'string', 'in:'.implode(',', FinancialTransactionStatus::values())],
            'description' => ['nullable', 'string', 'max:2000'],
            'reference' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $vehicleId = $this->integer('vehicle_id');
            $agencyId = $this->integer('agency_id');

            if (! $vehicleId || ! $agencyId) {
                return;
            }

            $vehicle = Vehicle::query()->find($vehicleId);

            if (! $vehicle) {
                return;
            }

            if ($vehicle->agency_id !== $agencyId) {
                $validator->errors()->add('agency_id', 'The selected vehicle does not belong to the selected agency.');
            }
        });
    }
}
