$email = "e2e_$(Get-Date -Format yyyyMMddHHmmss)@local.test"
$pw = 'Password123!'
Write-Output "Using email: $email"

try {
  $reg = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method Post -Body (@{name='E2E User'; email=$email; password=$pw} | ConvertTo-Json) -ContentType 'application/json'
} catch {
  Write-Error "Register failed: $_"
  exit 1
}
$login = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body (@{email=$email; password=$pw} | ConvertTo-Json) -ContentType 'application/json'
$token = $login.token
Write-Output "TOKEN:$token"

try {
  $cat = Invoke-RestMethod -Uri 'http://localhost:5000/api/categories' -Method Post -Body (@{name='Groceries'; color='#F97316'; type='expense'} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization='Bearer '+$token}
} catch {
  Write-Error "Create category failed: $_"
  exit 1
}
Write-Output "CATEGORY_ID:$($cat._id)"

try {
  $month = (Get-Date).ToString('yyyy-MM')
  $bud = Invoke-RestMethod -Uri 'http://localhost:5000/api/budgets' -Method Post -Body (@{category=$cat.name; limit=500; month=$month} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization='Bearer '+$token}
} catch {
  Write-Error "Create budget failed: $_"
  exit 1
}
Write-Output "BUDGET_ID:$($bud._id)"

try {
  $txn1 = Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions' -Method Post -Body (@{date=(Get-Date).ToString('s'); type='income'; category='Salary'; amount=2000; description='Test Income'} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization='Bearer '+$token}
} catch {
  Write-Error "Create txn1 failed: $_"
  exit 1
}
Write-Output "TXN1_ID:$($txn1._id)"

try {
  $txn2 = Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions' -Method Post -Body (@{date=(Get-Date).ToString('s'); type='expense'; category=$cat.name; amount=45.5; description='Test Grocery'} | ConvertTo-Json) -ContentType 'application/json' -Headers @{Authorization='Bearer '+$token}
} catch {
  Write-Error "Create txn2 failed: $_"
  exit 1
}
Write-Output "TXN2_ID:$($txn2._id)"

# Fetch lists
try {
  $txns = Invoke-RestMethod -Uri 'http://localhost:5000/api/transactions' -Method Get -Headers @{Authorization='Bearer '+$token}
  $buds = Invoke-RestMethod -Uri 'http://localhost:5000/api/budgets' -Method Get -Headers @{Authorization='Bearer '+$token}
  $cats = Invoke-RestMethod -Uri 'http://localhost:5000/api/categories' -Method Get -Headers @{Authorization='Bearer '+$token}
} catch {
  Write-Error "Fetch lists failed: $_"
  exit 1
}

Write-Output "TRANSACTIONS_COUNT:$($txns.Count)"
Write-Output "BUDGETS_COUNT:$($buds.Count)"
Write-Output "CATEGORIES_COUNT:$($cats.Count)"

Write-Output '---TRANSACTIONS---'
$txns | ConvertTo-Json -Depth 5
Write-Output '---BUDGETS---'
$buds | ConvertTo-Json -Depth 5
Write-Output '---CATEGORIES---'
$cats | ConvertTo-Json -Depth 5
