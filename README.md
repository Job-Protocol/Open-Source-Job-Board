# LimeAcademy Jobboard

The job board is powered by [JobProtocol](https://www.jobprotocol.com).  

Job Protocol lets companies list open roles with a referral bounty on the blockchain, incentivizing their community and our ecosystem of talent partners - recruiters, communities, agencies, networkers - to help hire top talent faster and cheaper.

![](https://uploads-ssl.webflow.com/624328d75b9d60a4652c67d5/624328d75b9d605b1c2c68f5_Group%2520228-p-500.png)

## Deployments

Live-data: [frontend-zeta-henna.vercel.app](https://frontend-zeta-henna.vercel.app)  
Test-data: [frontend-test-beta.vercel.app](https://frontend-test-beta.vercel.app)

## Usage

### Environment variables

In order to run this app, you need to set a few environment variables. 

- `GOOGLE_API_KEY`: Put your Gogle API key here. Places API must be enabled.
- `BUBBLE_API_PRIVATE_KEY`: Private key for jobprotocol API access on bubble
- `CONFIG_VERSION`: Can be `["dev", "production"]`. If unset or incorrect, defaults to `"dev"`. Determines whether the page connects to the "test" or the "live" version of Bubble database.

You can set variable wit `export VARIABLE="value"` or put the same command into your .bashrc to load it automatically when you start a terminal.

### Run page

Use `npm run dev` for development purposes.  

Else, start the app with

```
npm run build
npm run start
```
