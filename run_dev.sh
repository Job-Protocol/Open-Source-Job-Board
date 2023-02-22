function parse_yaml {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\):|\1|" \
        -e "s|^\($s\)\($w\)$s:$s[\"']\(.*\)[\"']$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=%s\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

eval $(parse_yaml file.yaml)
echo $MAIN_COLOR
echo $country

for p in $(parse_yaml file.yaml)
do
    export NEXT_PUBLIC_$p
    echo NEXT_PUBLIC_$p
    echo " "
done

#printenv

# Read colors from config file and write them to globals.scss
sed \
-e "s/MAIN_COLOR/${colors_main}/" \
-e "s/SECONDARY_COLOR/${colors_secondary}/" \
-e "s/TEXT_COLOR_LIGHT/${colors_text_light}/" \
-e "s/TEXT_COLOR_DARK/${colors_text_dark}/" \
-e "s/BACKGROUND_COLOR/${colors_background}/" \
-e "s/BORDER_COLOR/${colors_border}/" \
./styles/globals_template.scss > ./styles/globals.scss

next dev