import json

def get_posts():
    with open("files/posts.json", "r") as file:
        return json.load(file)


def save_posts(posts):
    with open("files/posts.json", "w") as file:
        json.dump(posts, file, indent=4)