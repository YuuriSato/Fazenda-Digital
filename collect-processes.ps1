$ErrorActionPreference = 'Stop'
$items = @(Get-Process | ForEach-Object {
 $proc = $_
 try {
  [PSCustomObject]@{pid=$proc.Id; name=$proc.ProcessName+'.exe'; cpuSeconds=$proc.TotalProcessorTime.TotalSeconds; memoryBytes=$proc.WorkingSet64; responding=$proc.Responding; startedAt=$proc.StartTime.ToUniversalTime().ToString('o')}
 } catch {
  [PSCustomObject]@{pid=$proc.Id; name=$proc.ProcessName+'.exe'; cpuSeconds=$null; memoryBytes=$null; responding=$null; startedAt=$null}
 }
})
ConvertTo-Json -InputObject $items -Compress
