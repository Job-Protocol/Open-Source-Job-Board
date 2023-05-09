
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
    'TEXT_COLOR_BANNER': conf['colors']['text']['banner'],
    'TEXT_COLOR_PRIMARY_BUTTON': conf['colors']['text']['primary_button'],
    'BACKGROUND_COLOR': conf['colors']['background'],
    'CARD_COLOR': conf['colors']['cards'],
    'FONT_REGULAR': conf['fonts']['regular'],
    'FONT_DEMIBOLD': conf['fonts']['demibold'],
    'BANNER_BACKGROUND_BACKGROUND': conf['banner']['background_background'],
    'BANNER_BACKGROUND': conf['banner']['background'],
    'BORDERS_CARDS_RADIUS': conf['borders']['cards']['radius'],
    'BORDERS_CARDS_WIDTH': conf['borders']['cards']['width'],
    'BORDERS_CARDS_COLOR': conf['borders']['cards']['color'],
    'BORDERS_CONTROLS_RADIUS': conf['borders']['controls']['radius'],
    'BORDERS_CONTROLS_WIDTH': conf['borders']['controls']['width'],
    'BORDERS_CONTROLS_COLOR': conf['borders']['controls']['color'],
    'SOCIAL_ICON_COLOR': conf['colors']['social_icons'],
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
