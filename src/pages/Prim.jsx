import React, { useState } from 'react';
import './prim.css';

const Prim = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    isPrime: false,
    paymentStatus: 'pending'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const primeBenefits = [
    '🎬 Unlimited HD Streaming',
    '🎵 Ad-free Music',
    '📚 Free E-books',
    '🚀 Fast Delivery',
    '⭐ Exclusive Deals',
    '📱 Multiple Device Support'
  ];

  const handleUserInput = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleCardInput = (e) => {
    let value = e.target.value;
    
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    
    setCardDetails({
      ...cardDetails,
      [e.target.name]: value
    });
  };

  const handlePayment = () => {
    if (!user.name || !user.email) {
      alert('Please fill your personal details first');
      return;
    }

    if (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardName)) {
      alert('Please fill all card details');
      return;
    }

    setUser({
      ...user,
      isPrime: true,
      paymentStatus: 'completed'
    });
    
    alert('🎉 Prime Membership Activated Successfully!');
  };

  return (
    <div className="prim-container">
      {/* Header */}
      <header className="prim-header">
        <h1>🚀 Prime Membership</h1>
      </header>

      <div className="prim-content">
        {/* Left Side - Prime Details */}
        <div className="prime-section">
          <div className="section-header">
            <h2>Prime Membership Details</h2>
          </div>

          {!user.isPrime ? (
            <div className="prime-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleUserInput}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleUserInput}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleUserInput}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* <div className="benefits-preview">
                <h4>You'll Get:</h4>
                <div className="benefits-list">
                  {primeBenefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          ) : (
            <div className="prime-active">
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Welcome to Prime, {user.name}!</h3>
                <p>Your membership is now active</p>
              </div>

              <div className="active-benefits">
                <h4>Your Prime Benefits:</h4>
                <div className="benefits-grid">
                  {primeBenefits.map((benefit, index) => (
                    <div key={index} className="benefit-card">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Payment */}
        <div className="payment-section">
          <div className="section-header">
            <h2>💳 Payment Details</h2>
          </div>

          {user.paymentStatus === 'completed' ? (
            <div className="payment-success">
              <div className="success-badge">✅</div>
              <h3>Payment Successful!</h3>
              <p>Thank you for your payment.</p>
              
              <div className="transaction-summary">
                <div className="summary-item">
                  <span>Amount Paid:</span>
                  <span>₹1179</span>
                </div>
                <div className="summary-item">
                  <span>Transaction ID:</span>
                  <span>TXN{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                </div>
                <div className="summary-item">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="payment-form">
              {/* Payment Methods */}
              <div className="payment-methods">
                <h4>Select Payment Method</h4>
                {/* <div className="method-options">
                  <button 
                    className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Card
                  </button>
                  <button 
                    className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    📱 UPI
                  </button>
                  <button 
                    className={`method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    🏦 Net Banking
                  </button>
                </div> */}
              </div>

              {/* Card Payment Form */}
              {/* {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInput}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInput}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInput}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={cardDetails.cardName}
                      onChange={handleCardInput}
                      placeholder="Enter card holder name"
                    />
                  </div>
                </div>
              )} */}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="upi-form">
                  <div className="form-group">
                    
                    <label>UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                    />
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {/* {paymentMethod === 'netbanking' && (
                <div className="netbanking-form">
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select>
                      <option>Select your bank</option>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                </div>
              )} */}

              {/* Order Summary */}
              <div className="order-summary">
                <h4>Order Summary</h4>
                <div className="summary-row">
                  <span>Prime Membership:</span>
                  <span>₹999</span>
                </div>
                <div className="summary-row">
                  <span>GST (18%):</span>
                  <span>₹180</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹1179</span>
                </div>
              </div>

              {/* Pay Button */}
              <button 
                className="pay-now-btn" 
                onClick={handlePayment}
                disabled={!user.name || !user.email}
              >
                {!user.name || !user.email ? 'Fill Details First' : 'Pay Now ₹1179'}
              </button>

              <div className="security-note">
                <span>🔒</span>
                <span>Secure & encrypted payment</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Footer */}
      <div className="features-footer">
        <div className="feature">
          <span>⚡</span>
          <span>Instant Activation</span>
        </div>
        <div className="feature">
          <span>🛡️</span>
          <span>100% Secure</span>
        </div>
        <div className="feature">
          <span>📞</span>
          <span>24/7 Support</span>
        </div>
        <div className="feature">
          <span>↩️</span>
          <span>Easy Cancellation</span>
        </div>
      </div>
    </div>
  );
};

export default Prim;