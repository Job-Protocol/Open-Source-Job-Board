IFS=''
for p in $(python3 parse_yaml.py)
do
    echo $p
    export $p
done

#printenv

# eval($(python3 parse_yaml.py)


# Read colors from config file and write them to globals.scss
sed \
-e "s/MAIN_COLOR/${NEXT_PUBLIC_colors_main}/" \
-e "s/SECONDARY_COLOR/${NEXT_PUBLIC_colors_secondary}/" \
-e "s/TEXT_COLOR_LIGHT/${NEXT_PUBLIC_colors_text_light}/" \
-e "s/TEXT_COLOR_DARK/${NEXT_PUBLIC_colors_text_dark}/" \
-e "s/BACKGROUND_COLOR/${NEXT_PUBLIC_colors_background}/" \
-e "s/BORDER_COLOR/${NEXT_PUBLIC_colors_border}/" \
./styles/globals_template.scss > ./styles/globals.scss


next dev
