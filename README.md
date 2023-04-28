# Open Source Job Board


The jobboard is powered by [JobProtocol](https://www.jobprotocol.com).  

Job Protocol lets companies list open roles with a referral bounty on the blockchain, incentivizing their community and our ecosystem of talent partners - recruiters, communities, agencies, networkers - to help hire top talent faster and cheaper.

![](https://uploads-ssl.webflow.com/624328d75b9d60a4652c67d5/624328d75b9d605b1c2c68f5_Group%2520228-p-500.png)

## Usage

### Environment variables

In order to run this app, you need to set a few environment variables. 

- `GOOGLE_API_KEY`: Put your Gogle API key here. Places API must be enabled.
- `BUBBLE_API_PRIVATE_KEY`: Private key for jobprotocol API access on bubble
- `CONFIG_VERSION`: Can be `["dev", "production"]`. If unset or incorrect, defaults to `"dev"`. Determines whether the page connects to the "test" or the "live" version of Bubble database.
- `CONFIG_FILE`: Particular jobboard config. E.g. `./configs/launchy.json`.
- `PASSWORD`: Used to access the admin menu.

You can set variable wit `export VARIABLE="value"` or put the same command into your .bashrc to load it automatically when you start a terminal.

### Run dev

Use `npm run dev` for development purposes.  

Else, start the app with

```
npm run build
npm run start
```

## Spin up a new board
 - Create a new config file. Use launchy as reference
 - In Vercel, create a new deployment of the release branch, just like the launch one. The only difference is the Environment varible specifiyin which JSON file to read
 
## Work left
- Read JSON file direcltly in SASS file, such that the preprocess.py step becomes unneccessary.
- Clean up the SASS. SASS can use variables and snippets. Take advantage and reduce boilerplate
- Move all the responsive design directly into the SASS class.
 -

test
