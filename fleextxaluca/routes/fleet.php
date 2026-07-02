<?php

use App\Http\Controllers\ReservationController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::resource('vehicles', VehicleController::class);
Route::resource('reservations', ReservationController::class);
