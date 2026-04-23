# Verdant Bank - Online Banking Portal

A modern, responsive online banking interface built with HTML, CSS, and JavaScript.

## Project Structure

```
cb/
├── index.html      # Main HTML structure
├── styles.css      # All styling (organized by component)
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Features

### 1. **Login & Authentication**
- Username: `gianluca.ginobledivittorio`
- Password: Any value (demo mode)
- Token verification: `263263` (after login)
- Secure login interface with error handling

### 2. **Dashboard**
- **Top Navigation** - Quick access to main features
- **Hero Card** - Welcome message with account balance
- **Statistics** - Monthly income, expenses, savings rate
- **Account Cards** - Savings and investment account details
- **Transaction History** - Filterable transaction list (All, Credits, Debits)

### 3. **Transfers**
- Multi-step transfer process (4 steps)
- Step 1: Enter recipient details (name, account, routing number, amount)
- Step 2: Review transfer details
- Step 3: Enter 4-digit PIN for verification (demo: `5125`)
- Step 4: Success confirmation with reference number

### 4. **Payments**
- Two payment methods:
  - **Instant Pay**: Send money via phone/email to a person
  - **Bill Pay**: Pay utility bills and subscriptions
- Same 4-step process as transfers
- PIN verification for security

## File Organization

### HTML (index.html)
```
- LOGIN SECTION
- DASHBOARD SECTION
  - Top Navigation Bar
  - Hero Card (Welcome + Balance)
  - Statistics Grid
  - Account Cards
  - Recent Transactions
- PAYMENT MODAL
- TRANSFER MODAL
```

### CSS (styles.css)
Organized by component:
```
- Global Reset & Base Styles
- Login Section Styles
- Dashboard & Navigation Styles
- Hero Card Styles
- Statistics Cards
- Account Cards
- Transaction Styles
- Modal Components
- Step Indicators
- Form Fields & Inputs
- Button Styles
- PIN Input & Number Pad
- Success Screen
- Payment Method Selection
```

### JavaScript (script.js)
Organized by feature:
```
- Global State Variables
- Login Management (doLogin, doLogout)
- Transaction Filtering (filterTxn)
- Transfer Modal Functions
  - Modal control (openTransfer, closeTransfer)
  - Step navigation (showStep, goStep2, etc.)
  - PIN input (pinPress, updatePinDisplay)
  - Submit (submitPin)
- Payment Modal Functions
  - Modal control (openPay, closePay)
  - Method selection (selectPayMethod)
  - Step navigation & validation
  - PIN handling
  - Submit (paySubmitPin)
- Modal Event Listeners
```

## Color Palette

- **Primary Blue**: `#185FA5` (buttons, active states, hero card)
- **Dark Blue**: `#0C447C` (hover states)
- **Success Green**: `#0F6E56` (credits, positive values)
- **Error Red**: `#c0392b` (debits, errors)
- **Light Gray**: `#f4f6f9` (background)
- **Border Gray**: `#e2e6ea` (card borders)

## Demo Credentials

- **Username**: `gianluca.ginobledivittorio`
- **Password**: Any value
- **Token**: `263263` (for verification after login)
- **PIN**: `5125` (for transfers and payments)
- **Account Balance**: $793,463.76

## Key Functions

### Authentication
- `doLogin()` - Validate and process login
- `doLogout()` - Return to login screen

### Transfer Flow
- `openTransfer()` / `closeTransfer()` - Modal control
- `goStep2()` - Validate recipient details
- `goStep3()` - Enter PIN
- `submitPin()` - Process transfer

### Payment Flow
- `selectPayMethod()` - Choose payment type
- `payGoStep2()` - Validate payment details
- `paySubmitPin()` - Process payment

### Utilities
- `showErr()` / `hideErr()` - Error message handling
- `updateStepUI()` - Update progress indicators
- `updatePinDisplay()` - Display PIN dots

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and desktop
- Requires JavaScript enabled

## Security Notes

- This is a **demo/prototype interface** for UI demonstration only
- No actual banking operations occur
- Passwords are not validated in the demo
- Use only for educational/portfolio purposes

## Future Enhancements

- Backend integration for real transactions
- Encryption and secure authentication
- Mobile app version
- Dark mode support
- Multi-language support
- Additional account types
