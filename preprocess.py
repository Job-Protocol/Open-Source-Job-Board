
import sys
import json
print("hello world")
print(sys.argv)

with open(sys.argv[1]) as f:
    conf = json.load(f)


d = {
    'MAIN_COLOR': conf['colors']['main'],
    'SECONDARY_COLOR': conf['colors']['secondary'],
    'TEXT_COLOR_LIGHT': conf['colors']['text']['light'],
    'TEXT_COLOR_DARK': conf['colors']['text']['dark'],
    'BACKGROUND_COLOR': conf['colors']['background'],
    'BORDER_COLOR': conf['colors']['border'],
}

with open('./styles/Variables_template.sass') as f:
    t = f.read()

for key, val in d.items():
    print(key, val)
    t = t.replace(key, val)

with open('./styles/Variables.sass', 'w') as f:
    f.write(t)
with open('./customer_config.json', 'w') as f:
    json.dump(conf, f)
