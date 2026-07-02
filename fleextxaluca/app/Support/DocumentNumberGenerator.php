<?php

namespace App\Support;

use Illuminate\Support\Str;

class DocumentNumberGenerator
{
    public function generate(string $prefix): string
    {
        return $prefix.'-'.now()->format('YmdHis').'-'.Str::upper(Str::random(5));
    }
}
