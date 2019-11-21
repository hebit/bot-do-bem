const { ibm_cloud_api } = require("./config.json")
const languageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const { url, version, api_key } = ibm_cloud_api.translator

const authenticator = new IamAuthenticator({
    apikey: api_key,
});

const languageTranslator = new languageTranslatorV3({
  version,
  authenticator,
  url,
  disableSslVerification: true,
});

languageTranslator.translateText = async (text) => {
    return await languageTranslator.translate({ text, modelId: 'pt-en' })
        .then(response => {
            let { translations } = response.result
            translations = translations.map(({ translation }) => translation)
            translations = translations.join(' ')

            translations = translations.replace('cu', 'asshole')
                .replace('fuder', 'fuck')
                .replace('arrombado', 'asshole')
            console.log('[translation]:', translations)
            return translations

        })
}

module.exports = languageTranslator
