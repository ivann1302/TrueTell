<?php

declare(strict_types=1);
use Illuminate\Support\Facades\Schedule;

Schedule::command('crm:deliver')->everyMinute()->withoutOverlapping(5);
