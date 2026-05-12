@echo off
echo Closing VS Code if running...
taskkill /F /IM code.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo Taking ownership of VS Code directory...
takeown /F "%LOCALAPPDATA%\Programs\Microsoft VS Code" /R /D Y >nul 2>&1

echo Granting full permissions...
icacls "%LOCALAPPDATA%\Programs\Microsoft VS Code" /grant "%USERNAME%:F" /T >nul 2>&1

echo Deleting NUL files using Win32 API...
(echo Add-Type -TypeDefinition @'
echo using System;
echo using System.Runtime.InteropServices;
echo public class NativeFile {
echo     [DllImport^("kernel32.dll", SetLastError=true, CharSet=CharSet.Unicode^)]
echo     public static extern bool DeleteFile^(string lpFileName^);
echo }
echo '@
echo $basePath = '%LOCALAPPDATA%\Programs\Microsoft VS Code'
echo $files = Get-ChildItem -Path $basePath -Recurse -Force ^| Where-Object { $_.Name -eq 'NUL' }
echo foreach ^($f in $files^) {
echo     $fullPath = '\\?\' + $f.FullName
echo     $result = [NativeFile]::DeleteFile^($fullPath^)
echo     if ^($result^) {
echo         Write-Host "Deleted: $^($f.FullName^)"
echo     } else {
echo         $err = [System.Runtime.InteropServices.Marshal]::GetLastWin32Error^(^)
echo         Write-Host "Failed: $^($f.FullName^) - Win32 Error: $err"
echo     }
echo }
) > "%TEMP%\delnul.ps1"

powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\delnul.ps1"
del "%TEMP%\delnul.ps1" >nul 2>&1

echo Done.
pause
