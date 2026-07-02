<?php

use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

Route::resource('vehicles', VehicleController::class);
