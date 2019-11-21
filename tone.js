const { ibm_cloud_api } = require("./config.json")
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
const dangerMessageAction = require('./actions')

const { url, version, api_key } = ibm_cloud_api.tone_analyzer

const authenticator = new IamAuthenticator({
    apikey: api_key,
});

const toneAnalyzer = new ToneAnalyzerV3({
  version,
  authenticator,
  url,
  disableSslVerification: true,
});

toneAnalyzer.analyze = async (text) => {
    const content = {
        toneInput: { text },
        acceptLanguage: 'pt-br',
    }
    const response = await toneAnalyzer.tone(content)
        .then(analyzeHandler)
        .catch(err => console.log('[error]:', err));
    return response
}

analyzeHandler = (toneAnalysis) => {
    let { tones } = toneAnalysis.result.document_tone
    tones_ids = tones.map(tone => tone.tone_id)

    tones = tones.filter(tone =>
        tone.score >= 0.5 &&
        (tone.tone_id === 'anger' || tones_ids.includes('sadness') && tones_ids.includes('fear'))
    )
    console.log('[analysis result]:', tones)
    return ({ result: tones, result_tags: tones_ids })
}

module.exports = toneAnalyzer;
