<?php

namespace App\Enums;

enum MessageStatus: string
{
    case New = 'new';
    case Open = 'open';
    case Replied = 'replied';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Open => 'Open',
            self::Replied => 'Replied',
        };
    }
}
