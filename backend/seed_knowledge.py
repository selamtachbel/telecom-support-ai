from database import SessionLocal
from models import KnowledgeBase

db = SessionLocal()

knowledge = [

{
    "question":"My internet is not working",
    "answer":"Restart your router, check all cable connections, wait 2 minutes, and reconnect. If the problem continues, contact Ethio Telecom on 994.",
    "category":"Internet",
},

{
    "question":"My internet is slow",
    "answer":"Restart your router, disconnect unused devices, and test your speed again. If the issue persists, report it through the My Ethiotel App or call 994.",
    "category":"Internet",
},

{
    "question":"My SIM card is not detected",
    "answer":"Turn off your phone, remove and reinsert the SIM card, then restart the device. If it still isn't detected, visit the nearest Ethio Telecom service center.",
    "category":"SIM",
},

{
    "question":"How do I check my bill?",
    "answer":"You can check your bill using the My Ethiotel App, by visiting an Ethio Telecom office, or by contacting customer care.",
    "category":"Billing",
},

{
    "question":"I want to buy a data package",
    "answer":"Dial *999#, open the My Ethiotel App, or use Telebirr to purchase a data package.",
    "category":"Packages",
},

{
    "question":"How do I buy a data package?",
    "answer":"Dial *999#, use the My Ethiotel App, or purchase through Telebirr.",
    "category":"Packages",
},

{
    "question":"How do I check my balance?",
    "answer":"Dial the balance USSD code provided by Ethio Telecom or use the My Ethiotel App.",
    "category":"Account",
},

{
    "question":"How do I transfer airtime?",
    "answer":"Open the My Ethiotel App or use the Airtime Transfer USSD service to transfer airtime.",
    "category":"Services",
},

{
    "question":"How do I manage my account?",
    "answer":"Manage your profile, recharge, buy packages, and pay bills using the My Ethiotel App.",
    "category":"Account",
},

{
    "question":"What telecom services are available?",
    "answer":"Ethio Telecom provides mobile, broadband internet, fiber, voice, SMS, Telebirr, roaming, and business solutions.",
    "category":"General",
},

{
    "question":"I need customer support",
    "answer":"Call Ethio Telecom Customer Care on 994 or visit your nearest service center.",
    "category":"Support",
},

{
    "question":"How can I speak with a support agent?",
    "answer":"Call 994 or visit the nearest Ethio Telecom office for assistance.",
    "category":"Support",
}

]

added = 0

for item in knowledge:

    exists = db.query(KnowledgeBase).filter(
        KnowledgeBase.question == item["question"]
    ).first()

    if not exists:
        db.add(KnowledgeBase(**item))
        added += 1

db.commit()

print(f"Inserted {added} knowledge records.")

db.close()