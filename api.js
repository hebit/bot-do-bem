const config = require("./config.json")
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const { url, version, api_key } = config.ibm_cloud_api.tone_analyzer
const toneAnalyzer = new ToneAnalyzerV3({
  version,
  authenticator: new IamAuthenticator({
    apikey: api_key,
  }),
  url,
  disableSslVerification: true,
});

toneAnalyzer.analyze = async (text) => {
    const content = {
        toneInput: { text },
        acceptLanguage: 'pt-br',
    }
    const response = await toneAnalyzer.tone(content)
        .then(toneAnalysis => {
            let { tones } = toneAnalysis.result.document_tone
            tones_ids = tones.map(tone => tone.tone_id)
            console.log('ids:',tones_ids)
            tones = tones.filter(tone => 
                tone.score >= 0.5 && 
                (tone.tone_id === 'anger' || tones_ids.includes('sadness') && tones_ids.includes('fear'))
            )
           return { result: tones, result_tags: tones_ids}
        })
        .catch(err => {
            console.log('error:', err);
        });
    return response
}

module.exports = toneAnalyzer;