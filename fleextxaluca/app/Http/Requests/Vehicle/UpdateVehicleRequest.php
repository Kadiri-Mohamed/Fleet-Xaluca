<?php

namespace App\Http\Requests\Vehicle;

use App\Enums\VehicleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
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
        $vehicle = $this->route('vehicle');
        $vehicleId = $vehicle?->id;
        $agencyId = $this->integer('agency_id');

        return [
            'agency_id' => ['required', 'integer', 'exists:agencies,id'],
            'unit_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vehicles', 'unit_number')
                    ->where(fn ($query) => $query->where('agency_id', $agencyId))
                    ->ignore($vehicleId),
            ],
            'plate_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('vehicles', 'plate_number')
                    ->where(fn ($query) => $query->where('agency_id', $agencyId))
                    ->ignore($vehicleId),
            ],
            'vin' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('vehicles', 'vin')
                    ->where(fn ($query) => $query->where('agency_id', $agencyId))
                    ->ignore($vehicleId),
            ],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'color' => ['nullable', 'string', 'max:100'],
            'vehicle_type' => ['nullable', 'string', 'max:100'],
            'fuel_type' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'string', Rule::in(VehicleStatus::values())],
            'odometer' => ['required', 'integer', 'min:0'],
            'acquisition_date' => ['nullable', 'date'],
            'disposal_date' => ['nullable', 'date', 'after_or_equal:acquisition_date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
