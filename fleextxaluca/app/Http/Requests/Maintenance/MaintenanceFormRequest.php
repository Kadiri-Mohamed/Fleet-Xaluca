<?php

namespace App\Http\Requests\Maintenance;

use App\Enums\MaintenanceStatus;
use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class MaintenanceFormRequest extends FormRequest
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
            'description' => ['required', 'string', 'max:2000'],
            'scheduled_at' => ['required', 'date'],
            'cost' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', Rule::in(MaintenanceStatus::values())],
            'type' => ['nullable', 'string', 'max:100'],
            'vendor_name' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
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
