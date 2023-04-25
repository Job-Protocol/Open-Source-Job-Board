
with open('file.yaml') as f:
    lines = f.readlines()
    


d = {}

def count_leading_spaces(line):
    
    for lead in range(100,0,-1):
        if line.startswith(''.join([' ']*lead)):
            return lead
    return 0


prefixes=[]
oldindent=0
key=""

out=[]

indent2index={0: 0}
for line in lines:
    indent = count_leading_spaces(line)
    if indent>oldindent:
        prefixes.append(key)
        indent2index[indent]=len(prefixes)
        
    if indent<oldindent:
        prefixes = prefixes[:indent2index[indent]]
        
    
    oldindent = indent
    
    key, val = line.strip().split(':')
    
    if val:
        outline=f"{'NEXT_PUBLIC_'+'_'.join(prefixes+[key])}='{val.strip()}'"
        out.append(outline+'\n')
        print(outline)


with open('temp.sh', 'w') as f:
    f.writelines(out)
    
# import subprocess
# subprocess.run(["next", "dev"])
    
    
    
    