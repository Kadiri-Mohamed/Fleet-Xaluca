<?php

namespace App\Http\Requests\Reservation;

class StoreReservationRequest extends ReservationFormRequest
{
    protected function reservationId(): ?int
    {
        return null;
    }
}
