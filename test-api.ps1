# Define the URL
$baseUrl = "http://localhost:3000/api"

try {
    # 1. Test the Health Check
    Write-Host "1. Testing Health Check..." -ForegroundColor Cyan
    $healthCheck = Invoke-RestMethod -Uri "$baseUrl" -Method Get
    Write-Host "Health check successful: $healthCheck" -ForegroundColor Green

    # 2. Test API Documentation
    Write-Host "`n2. Testing API Documentation..." -ForegroundColor Cyan
    $docsResponse = Invoke-WebRequest -Uri "$baseUrl/docs" -Method Get
    if ($docsResponse.StatusCode -eq 200) {
        Write-Host "API docs accessible at http://localhost:3000/api/docs" -ForegroundColor Green
    }

    # 3. Create a new user (matching your Prisma schema)
    Write-Host "`n3. Creating a new user..." -ForegroundColor Cyan
    $randomNum = Get-Random -Minimum 1000 -Maximum 9999
    $phone = "080$randomNum$(Get-Random -Minimum 10000 -Maximum 99999)"
    
    $userData = @{
        email         = "testuser$randomNum@example.com"
        phone         = $phone
        password      = "Password123!"
        firstName     = "Test"
        lastName      = "User"
        userType      = "RIDER"  # or "DRIVER"
    } | ConvertTo-Json

    Write-Host "Sending data: $userData" -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "$baseUrl/user" -Method Post -Body $userData -ContentType "application/json"

    # 4. Verify Success and extract ID
    Write-Host "`n✅ User created successfully!" -ForegroundColor Green
    $response | Format-List
    
    if ($response.id) {
        $userId = $response.id
        Write-Host "`nNew user ID: $userId" -ForegroundColor Yellow
        
        # 5. Retrieve the created user
        Write-Host "`n4. Retrieving user by ID..." -ForegroundColor Cyan
        $getResponse = Invoke-RestMethod -Uri "$baseUrl/user/$userId" -Method Get
        Write-Host "User retrieved successfully:" -ForegroundColor Green
        $getResponse | Format-List
        
        # 6. Get user by email
        Write-Host "`n5. Retrieving user by email..." -ForegroundColor Cyan
        $emailResponse = Invoke-RestMethod -Uri "$baseUrl/user/email/$($userData | ConvertFrom-Json).email" -Method Get
        Write-Host "User found by email:" -ForegroundColor Green
        $emailResponse | Format-List
    }

} catch {
    Write-Host "`n❌ An error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try to get more details
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse body: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan