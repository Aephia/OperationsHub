# Registers (or removes) a Windows scheduled task that runs the C4 Live collector once an hour.
# Usage:  powershell -ExecutionPolicy Bypass -File Tools\c4-live\install-schedule.ps1
#         powershell -ExecutionPolicy Bypass -File Tools\c4-live\install-schedule.ps1 -Remove
# The task runs as the current user, only while logged on, and writes Data\c4-live\ plus collector.log.
param([switch]$Remove)
$ErrorActionPreference = 'Stop'
$name = 'OperationsHub C4 Live collector'
if ($Remove) {
    Unregister-ScheduledTask -TaskName $name -Confirm:$false
    Write-Output "Removed scheduled task: $name"
    exit 0
}
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$node = (Get-Command node).Source
# The collector appends to collector.log itself and rotates it at 5 MB (--log). The shell only keeps the
# LAST run's raw output (overwritten each hour, so bounded) to catch a crash before logging starts.
$cmd = "/c cd /d `"$dir`" && `"$node`" collector.mjs --once --log collector.log > collector.last.log 2>&1"
$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument $cmd -WorkingDirectory $dir
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Hours 1)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 15) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $name -Action $action -Trigger $trigger -Settings $settings -Description 'Hourly z.ink SAGE C4 read for OperationsHub C4Live' -Force | Out-Null
$t = Get-ScheduledTask -TaskName $name
Write-Output ("Registered: {0} | state {1} | next run {2}" -f $name, $t.State, (Get-ScheduledTaskInfo -TaskName $name).NextRunTime)
