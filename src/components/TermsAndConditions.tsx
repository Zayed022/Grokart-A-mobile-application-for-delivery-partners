import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";

class TermsAndConditions extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Grokart Delivery Partner Terms & Conditions
        </Text>
        <ScrollView style={styles.scroll}>
          <Text style={styles.text}>
            {`
Effective Date: [Insert Date]
Version: 1.0

Welcome to the Grokart Delivery Partner App. By using the app, you agree to the following Terms & Conditions. Please read them carefully.

1. DEFINITIONS
- “Company” refers to Grokart (operated by [Insert Legal Entity Name]).
- “Delivery Partner” refers to you, the independent contractor providing delivery services via the platform.
- “Customer” refers to any end user placing an order on the Grokart platform.
- “App” means the Grokart Delivery Partner mobile application.

2. NATURE OF ENGAGEMENT
- You are engaged as an independent contractor, not an employee, agent, or representative of the Company.
- You are free to choose your working hours and may accept or reject delivery requests at your discretion.

3. ELIGIBILITY
- You must be at least 18 years old.
- You must possess a valid driving license, government-issued ID, and necessary permits.
- You must own or have legal access to a vehicle in good condition and comply with safety regulations.

4. ONBOARDING & DOCUMENTS
- You agree to provide accurate personal, banking, and KYC documents.
- The Company may verify your background, criminal history, and driving record.

5. DELIVERY SERVICES
- You are responsible for safe and timely pickup and delivery of goods.
- You must comply with traffic laws, road safety, and hygiene requirements.
- Orders should not be tampered with, opened, or consumed.

6. COMPENSATION & PAYOUTS
- You will receive delivery fees as communicated via the app.
- The Company may deduct service charges, penalties, or applicable taxes.
- Payments will be made on a [daily/weekly] basis to your registered account.

7. CASH ON DELIVERY (COD) HANDLING
- You must promptly deposit collected COD amounts as per the Company’s policy.
- Failure to remit COD amounts may lead to suspension, penalties, or legal action.

8. EQUIPMENT & UNIFORMS
- If provided, bags, boxes, or uniforms remain Company property.
- You must return them in good condition upon deactivation.

9. CONDUCT EXPECTATIONS
- Be polite and professional with customers, merchants, and staff.
- Do not engage in theft, fraud, substance abuse, or harassment.
- Maintain hygiene and personal presentation.

10. DEACTIVATION POLICY
- Violations such as theft, fraud, harassment, repeated order cancellations, or failure to remit COD can result in permanent suspension.
- The Company may suspend or terminate your access with immediate effect for serious breaches.

11. LIABILITY
- You are responsible for your own safety and insurance coverage.
- The Company is not liable for accidents, personal injury, or third-party damages during delivery.

12. DATA & PRIVACY
- The Company will collect, process, and store your personal data as per applicable laws.
- By using the app, you consent to such data usage.

13. DISPUTE RESOLUTION
- All disputes shall be resolved via arbitration under the Arbitration and Conciliation Act, 1996.
- Jurisdiction: [Insert City], India.

14. GOVERNING LAW
- These Terms shall be governed by the laws of India.

15. CONTACT & GRIEVANCE OFFICER
For questions or complaints, contact:
[Insert Company Contact Info]
Grievance Officer: [Insert Name]
Email: [Insert Email]

---
ANNEXURES
A. Deactivation Policy (detailed)
B. Fee & Payout Illustration
C. COD Remittance Policy
D. Equipment Deposit Policy
`}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
});
