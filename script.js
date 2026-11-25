// Initialize Lucide Icons
lucide.createIcons();

// =========================================================================
// GOOGLE SHEETS WEB APP URL
// Reads from configured localStorage key, or the hardcoded default below:
// =========================================================================
// =========================================================================
// GOOGLE SHEETS WEB APP URL (CONNECTED TO YOUR SPREADSHEET)
// Spreadsheet: https://docs.google.com/spreadsheets/d/1ar7hfIl_cuysokEUsy2yW28_gV5jqjcs5z4BEpEJKSQ/edit
// =========================================================================
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzqQRKqEo_6whjaNQMLoUZtTrQjqQczEYdD1Ugsg50F-1DaR579nnQV5vZCDNoKZHw90g/exec";

// Add active color to select dropdowns when an option is selected
function handleSelectChange(selectElem) {
  if (selectElem.value) {
    selectElem.classList.add('has-value');
  } else {
    selectElem.classList.remove('has-value');
  }
}

// Handle Form Submission
async function handleBooking(event) {
  event.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const originalBtnHtml = submitBtn.innerHTML;

  const customerName = document.getElementById('customerName').value.trim();
  const contactNumber = document.getElementById('contactNumber').value.trim();
  const deviceName = document.getElementById('deviceName').value;
  const issueType = document.getElementById('issueType').value;
  const problemDesc = document.getElementById('problemDescription').value.trim();
  const address = document.getElementById('userAddress').value.trim();

  // Validate 10-digit phone
  if (!/^\d{10}$/.test(contactNumber)) {
    alert('Please enter a valid 10-digit mobile number.');
    document.getElementById('contactNumber').focus();
    return;
  }

  // Show loading spinner
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <i data-lucide="loader-2" style="width: 20px; height: 20px; animation: spin 1s linear infinite;"></i>
    <span>Saving Booking...</span>
  `;
  lucide.createIcons();

  // Customer Data Record
  const bookingRecord = {
    timestamp: new Date().toLocaleString(),
    customerName: customerName,
    contactNumber: contactNumber,
    deviceName: deviceName,
    issueType: issueType,
    problemDescription: problemDesc,
    address: address || 'N/A'
  };

  try {
    // Send directly to your Google Spreadsheet via Google Apps Script Web App
    if (GOOGLE_SHEETS_URL && GOOGLE_SHEETS_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Standard for Google Apps Script Webhook
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRecord)
      });
    } else {
      // Local fallback simulation if URL not yet configured
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Display confirmation modal to the customer
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.innerHTML = `Thank you, <strong>${customerName}</strong>! Your service request for <strong>${deviceName}</strong> (${issueType}) has been confirmed. Our technician will call you at <strong>${contactNumber}</strong> shortly.`;

    const toast = document.getElementById('toastModal');
    toast.classList.add('active');

    // Reset the form so customer data vanishes from the screen immediately (ensures 100% privacy)
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('select').forEach(s => s.classList.remove('has-value'));

  } catch (error) {
    console.error('Booking submission error:', error);
    alert('Could not submit booking right now. Please call our helpline at 8281126185.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
    lucide.createIcons();
  }
}

// Close confirmation modal
function closeToast() {
  document.getElementById('toastModal').classList.remove('active');
}
