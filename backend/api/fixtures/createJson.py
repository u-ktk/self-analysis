import json
import os

file_path = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'questions.txt')


def create_json():
    with open(file_path, "r") as file:
        lines = file.readlines()

    questions = []

    for index, line in enumerate(lines):
        columns = line.strip().split('\t')  # タブ区切りで分割
        question = {
            "id": index + 1,
            "text": columns[0],
            "categoryId": int(columns[1]),
            "subcategory": columns[2],
            "isDefault": True,
        }

        questions.append(question)

    data = {
        "questions": questions
    }

    with open('questions.json', 'w') as json_file:
        json.dump(data, json_file, indent=2)


create_json()


# 以下、jsonファイルのインポート方法
# for item in data['questions']:
#     question = Question(
#         category = QuestionCategory.objects.get(pk=item['categoryId']),
#         text=item['text'],
#         age=item['subcategory'],
#         is_default=item['isDefault']
#     )
#     question.save()
    
# with open('path', 'r') as file:
#     categories = json.load(file)
    
# with open('path', 'r') as file:
#     data = json.load(file)
