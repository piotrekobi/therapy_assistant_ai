import json

def increment_stat(username, stat):
    with open("files/users.json", "r+") as file:
        users = json.load(file)
        user = users.get(username)
        if user:
            user["stats"][stat] += 1
            file.seek(0)
            json.dump(users, file, indent=4)
            file.truncate()