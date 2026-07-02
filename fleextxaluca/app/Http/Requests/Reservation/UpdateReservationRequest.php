<?php

namespace App\Http\Requests\Reservation;

class UpdateReservationRequest extends ReservationFormRequest
{
    protected function reservationId(): ?int
    {
        return $this->route('reservation')?->id;
    }
}
