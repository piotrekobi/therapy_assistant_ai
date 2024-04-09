from utils.auth import save_users

def update_knowledge(client, username, current_knowledge, messages, user_text, user_data):
    messages_for_analysis = [
        {
            "role": "system",
            "content": "Twoim zadaniem jest strzeszczanie informacji o pacjencie w terapii jąkania, nic więcej.",
        },
        {
            "role": "system",
            "content": "Jeśli z poniższych wiadomości wynikają nowe informacje o pacjencie, stwórz nową zawartość wiedzy o pacjencie dla asystenta w terapii jąkania. Tekst zawierający informacje ma być jak najkrótszy. Zbieraj wszystkie możliwe informacje. Nie pisz żadnego nagłówka. Wypisuj od początku fakty. Twoja wypowiedź ma zawierać tylko i wyłącznie informacje o pacjencie, nic więcej. Pamiętaj, że nowe informacje muszą zawierać wszystkie poprzednie informacje, chyba, że uległy one zmianie. Jeśli z ostatniej wiadomości pacjenta nie wynikają żadne nowe informacje, odpowiedz tylko 'brak nowych informacji'.",
        },
        {
            "role": "system",
            "content": "Aktualna wiedza o pacjencie: " + current_knowledge,
        },
        {
            "role": "system",
            "content": f"""
Ostatnia wiadomość pacjenta: {user_text} """
        },
    ]
    

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages_for_analysis,
        temperature=1.0,
        max_tokens=300,
    )

    analysis_response = response.choices[0].message.content

    if "brak nowych informacji" not in analysis_response.lower():
        user_data[username]["settings"]["assistantKnowledge"] = analysis_response
        save_users(user_data)