<?php

namespace App\Http\Requests\Reservation;

use App\Actions\Reservations\ReservationConflictDetector;
use App\Enums\ReservationStatus;
use App\Models\Vehicle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

abstract class ReservationFormRequest extends FormRequest
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
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:'.implode(',', ReservationStatus::values())],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $vehicleId = $this->integer('vehicle_id');
            $startAt = $this->date('start_at');
            $endAt = $this->date('end_at');

            if (! $vehicleId || ! $startAt || ! $endAt) {
                return;
            }

            $vehicle = Vehicle::query()->find($vehicleId);

            if (! $vehicle) {
                return;
            }

            if ($vehicle->status !== 'available') {
                $validator->errors()->add('vehicle_id', 'This vehicle is not available for reservations.');
                return;
            }

            if ($vehicle->agency_id !== $this->integer('agency_id')) {
                $validator->errors()->add('agency_id', 'The selected vehicle does not belong to the selected agency.');
                return;
            }

            $conflicts = app(ReservationConflictDetector::class)->conflicts(
                $vehicleId,
                $startAt,
                $endAt,
                $this->reservationId(),
            );

            if ($conflicts->isNotEmpty()) {
                $validator->errors()->add('start_at', 'The selected vehicle is already reserved in this period.');
                $validator->errors()->add('vehicle_id', 'Choose another vehicle or change the time range.');
            }
        });
    }

    abstract protected function reservationId(): ?int;
}
