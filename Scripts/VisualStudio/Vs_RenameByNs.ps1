$match = "OriginalNamespace"
$matchFilter = "*OriginalNamespace*"
$replacement = "NewNamespace"

$files = Get-ChildItem $(get-location) -filter $matchFilter -Recurse

$files |
    Sort-Object -Descending -Property { $_.FullName } |
    Rename-Item -newname { $_.name -replace $match, $replacement } -force



$files = Get-ChildItem $(get-location) -include *.cs, *.csproj, *.sln, *.ncrunchproject, *.config, *.xaml -Recurse 

foreach($file in $files) 
{ 
    ((Get-Content $file.fullname) -creplace $match, $replacement) | set-content $file.fullname 
}

#read-host -prompt "Done! Press any key to close."