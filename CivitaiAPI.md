````json
{
  "items": [
    {
      "id": 3036,
      "name": "CharTurner - Character Turnaround helper for 1.5 AND 2.1!",
      "description": "<h1>CharTurner</h1><p>Edit: <strong>controlNet</strong> works <strong>great </strong>with this. Charturner keeps the outfit consistent, controlNet openPose keeps the turns under control. </p><p><strong>Three versions,</strong> scroll down to pick the right one for you.</p><p>If you're unsure of what version you are running, it's <em>probably</em> 1.5, as it is more popular, but 2.1 is newer and gaining ground fast.</p><p><strong>Version 2, for 2.0 and 2.1 models<br />Version 2, for 1.5 models<br />Version 1, for 1.5 models</strong></p><p>BONUS: <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/7252/charturnerbeta-lora-experimental\">Experimental </a>LORA released<br />used at your own risk. :D (mixes well tho)</p><p>Hey there! I'm a working artist, and I loathe doing character turnarounds, I find it the least fun part of character design. I've been working on an embedding that helps with this process, and, though it's not where I want it to be, I was encouraged to release it under the <a target=\"_blank\" rel=\"ugc\" href=\"https://en.wikipedia.org/wiki/Minimum_viable_product\"><u>MVP</u></a> principle.</p><p>I'm also working on a few more character embeddings, including a head turn around and an expression sheet. They're still way too raw to release tho.</p><p>Is there some type of embedding that would be useful for you? Let me know, i'm having fun making tools to fix all the stuff I hate doing by hand.</p><p>v1 is still a little bit... fiddly.</p><ul><li><p>Sampler: I use DPM++ 2m Karras or DDIM most often.</p></li><li><p>Highres. fix ON for best results</p></li><li><p>landscape orientation will get you more 'turns'; square images tend toward just front and back.</p></li><li><p>I like <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/2540/elldreths-stolendreams-mix\"><u>https://civitai.com/models/2540/elldreths-stolendreams-mix</u></a> to make characters in.</p></li><li><p>I use an embedding trained on my own art (smoose) that I will release if people want it? But it's an aesthetic thing, just my own vibe.</p></li><li><p>I didn't really test this in any of the waifu/NAI type models, as I don't usually use them. Looks like it works but it probably has its own special dance.</p></li></ul><p>Things I'm working on for v2: EDIT: <strong>V2 out, see below! (also v2 2.1)</strong></p><ul><li><p>It fights you on style sometimes. I'm adding more various types of art styles to the dataset to combat this. -<strong> V2 has much better styles</strong></p></li><li><p>Open front coats and such tend to be open 'back' on the back view. Adding more types of clothing to the dataset to combat this. - <strong>Still has this problem</strong></p></li><li><p>Tends toward white and 'fit' characters, which isn't useful. Adding more diversity in body and skin tone to the dataset to combat this. - <strong>v2 Much more body and racial diversity added to the set, easier to get different results.</strong></p></li></ul><p>Helps create multiple full body views of a character. The intention is to get at least a front and back, and ideally, a front, 3/4, profile, 1/4 and back versions, in the same outfit.</p><p></p>",
      "type": "TextualInversion",
      "poi": false,
      "nsfw": false,
      "allowNoCredit": true,
      "allowCommercialUse": "Rent",
      "allowDerivatives": true,
      "allowDifferentLicense": true,
      "stats": {
        "downloadCount": 56206,
        "favoriteCount": 7433,
        "commentCount": 236,
        "ratingCount": 56,
        "rating": 4.63
      },
      "creator": {
        "username": "mousewrites",
        "image": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bdfe115f-4430-4ee7-31bc-eff38f86c500/width=96/mousewrites.jpeg"
      },
      "tags": [
        "character",
        "consistent character",
        "turnaround",
        "model sheet"
      ],
      "modelVersions": [
        {
          "id": 9857,
          "modelId": 3036,
          "name": "CharTurner V2 - For 2.1",
          "createdAt": "2023-02-12T22:44:01.442Z",
          "updatedAt": "2023-03-15T18:58:13.476Z",
          "trainedWords": ["21charturnerv2"],
          "baseModel": "SD 2.1",
          "earlyAccessTimeFrame": 0,
          "description": "<p>I'm not great at prompting for 2.1 yet, so I\"m sure your prompts will work better with it. Works fantastic with negative embeds. (still collecting links)</p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/7728/negativemutation\">https://civitai.com/models/7728/negativemutation</a></p>",
          "stats": {
            "downloadCount": 25874,
            "ratingCount": 7,
            "rating": 4.29
          },
          "files": [
            {
              "name": "21charturnerv2.pt",
              "id": 9500,
              "sizeKB": 17.017578125,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "PickleTensor"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "No Pickle imports",
              "virusScanResult": "Success",
              "scannedAt": "2023-02-12T22:45:53.210Z",
              "hashes": {
                "AutoV2": "F253ABB016",
                "SHA256": "F253ABB016C22DD426D6E482F4F8C3960766DE6E4C02F151478BFB98F6985383",
                "CRC32": "F500AADD",
                "BLAKE3": "E7163C1A3F6B135A3E473CDD749BC1E6F4ED2D1AB43FEB1ACC4BEB1E5C205260"
              },
              "downloadUrl": "https://civitai.com/api/download/models/9857",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d197481b-1c21-4c14-c7fd-708f838a1000/width=450/96744.jpeg",
              "nsfw": false,
              "width": 1238,
              "height": 1293,
              "hash": "UAEVA;?]JoR6+^OaNxxC^jXSWXjF?G$~s.WY",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e1fe96b4-c2e0-4e8b-094f-051a7e69e700/width=450/95916.jpeg",
              "nsfw": false,
              "width": 1398,
              "height": 1259,
              "hash": "U4FrbC^ljH_MFV00IUx[00McbvoM03o}t7xG",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/613ec8af-7010-4b24-38b3-aa4488b9b000/width=450/95915.jpeg",
              "nsfw": false,
              "width": 992,
              "height": 792,
              "hash": "U7Du;[xZRj~A-pt7a#Rj0hR+ofNH01WBoJbI",
              "meta": {
                "ENSD": "31337",
                "Size": "640x512",
                "seed": 2457887243,
                "Score": "6.66",
                "steps": 30,
                "prompt": "21CharTurnerV2 (character turnaround:1) of a woman in a greek outfit. Goddess, laurel leaves, rimlight, subsurface scattering",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 4.5,
                "resources": [],
                "Model hash": "5f8c744ab3",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles.",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/478efb4a-d63c-4b0d-8f19-bd60d52fc700/width=450/95914.jpeg",
              "nsfw": false,
              "width": 1184,
              "height": 792,
              "hash": "USIEU--:xut6tmofWWoL~UV@ayay-pbHjZbH",
              "meta": {
                "ENSD": "31337",
                "Size": "768x512",
                "seed": 2930407241,
                "Score": "4.53",
                "steps": 30,
                "prompt": "21CharTurnerV2 (character turnaround:1) of a mailman. Male, dark hair, tattoos, blue uniform. multiple views of the same character, Highly detailed,, classicnegative",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 13,
                "resources": [],
                "Model hash": "2c29f8668c",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/04e55b16-e671-463a-bde9-3898f053e600/width=450/95913.jpeg",
              "nsfw": false,
              "width": 792,
              "height": 792,
              "hash": "UFG+R6NLs+D*02xujGRkH?S$V?kV?^RjkVtR",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 2355045755,
                "Score": "5.84",
                "steps": 30,
                "prompt": "21CharTurnerV2 character turnaround of young boy as a paperboy, cute adorable little kid, full body, standing, same outfit",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 6.5,
                "resources": [],
                "Model hash": "5f8c744ab3",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a70413cb-e2bf-4a92-25e5-ed4786452a00/width=450/95912.jpeg",
              "nsfw": false,
              "width": 792,
              "height": 792,
              "hash": "UIHLI%E3D*02~TbcaKEM0M%1$^%9^WWsm-n",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 4205732814,
                "Score": "6.53",
                "steps": 30,
                "prompt": "21CharTurnerV2 character turnaround of young boy as a paperboy, cute adorable little kid, full body, standing, same outfit, concept-art",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 3.5,
                "resources": [],
                "Model hash": "639d0db70f",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dd2d972b-42d4-45d2-9be5-ce4baf407700/width=450/95911.jpeg",
              "nsfw": false,
              "width": 792,
              "height": 792,
              "hash": "U7DI:yoe~V%L^*jsRkof9Zay9ZWC-oofM{WB",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 3743692480,
                "Score": "6.4",
                "steps": 30,
                "prompt": "21CharTurnerV2 character turnaround of Native american man in a business suit, full body, standing, same outfit",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 6.5,
                "resources": [],
                "Model hash": "88ecb78256",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "child, costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,, bad_prompt_version2, DreamArtistBADHAND-neg, NG_DeepNegative_V1_75T, Unspeakable-Horrors-Composition-4v",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/04bab185-a5f6-447a-870c-2fd1b1fc9c00/width=450/95910.jpeg",
              "nsfw": false,
              "width": 792,
              "height": 792,
              "hash": "UAG8.ZoL00E1%0oMV@M|8{xt?axt~pj[xtxu",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 789330043,
                "Score": "4.82",
                "steps": 30,
                "prompt": "21CharTurnerV2 character turnaround of Native american man in a business suit, full body, standing, same outfit",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 6.5,
                "resources": [],
                "Model hash": "5f8c744ab3",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "child, costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c8ae65bb-2616-4774-ce6b-4527f20b1b00/width=450/95909.jpeg",
              "nsfw": false,
              "width": 1184,
              "height": 792,
              "hash": "UNIE@Nt7%MoftSofofay~pogM{oz_3kCRjof",
              "meta": {
                "ENSD": "31337",
                "Size": "768x512",
                "seed": 2930407238,
                "Score": "4.54",
                "steps": 30,
                "prompt": "21CharTurnerV2 (character turnaround:1) of a mailman. Male, dark hair, tattoos, blue uniform. multiple views of the same character, Highly detailed,, classicnegative",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 13,
                "resources": [],
                "Model hash": "2c29f8668c",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d91b46e7-7d69-43db-239d-412bdd8ed400/width=450/95908.jpeg",
              "nsfw": false,
              "width": 792,
              "height": 792,
              "hash": "UGF6CBnNI9xB~WxDs:RPVtaJofRQ00bwj@ad",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 2355045759,
                "Score": "5.88",
                "steps": 30,
                "prompt": "21CharTurnerV2 character turnaround of young boy as a paperboy, cute adorable little kid, full body, standing, same outfit",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 6.5,
                "resources": [],
                "Model hash": "5f8c744ab3",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "costume variations, outfit variations, sci-fi, tight clothes, skin tight, muscles., cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry,bad anatomy , liquid body, malformed, mutated, bad proportions, uncoordinated body, unnatural body, disfigured, ugly, gross proportions ,mutation, disfigured, deformed, (mutation), (poorly drawn), wet, legs feet, cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands,",
                "Denoising strength": "0.7"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/9857"
        },
        {
          "id": 8387,
          "modelId": 3036,
          "name": "CharTurner V2 - For 1.5",
          "createdAt": "2023-02-07T03:46:57.500Z",
          "updatedAt": "2023-03-15T18:58:13.476Z",
          "trainedWords": ["charturnerv2"],
          "baseModel": "SD 1.5",
          "earlyAccessTimeFrame": 0,
          "description": "<p>2.1 and LoRa versions coming soon.</p><p><strong>Prompt hints</strong>: format something like this: \"A character turnaround of a (X) wearing (Y). \" In some of the prompts the token is spelled differently: due to some technical issues with xformers, I trained this badboy about 40 times, and some of the examples are from those trainings. All the same dataset, I promise.  Just change any weird token names to CharTurnerV2 if you use them.</p><p><strong>Token - \"CharTurnerV2\"</strong> place at the front for stronger effect, place at the end for a weaker effect. Token weighting works too</p><p><strong>Add</strong>:</p><ul><li><p>\"Multiple views of the same character in the same outfit\"</p></li><li><p>Add original CharTurner to mix back in some anime/turns</p></li><li><p>Add charTurner Lora (uploading soon) on top (at very low strength, like .3) to really force the turn. Will affect style.</p></li></ul><p>Next Version: (after the v2 lora and 2.1 versions): Looking for more variety for the data set! Post a review or comment with your best turn around (especially if it was a hard one to get it to do!) and I will use it in the V3 dataset.  </p>",
          "stats": {
            "downloadCount": 17908,
            "ratingCount": 27,
            "rating": 4.7
          },
          "files": [
            {
              "name": "charturnerv2.pt",
              "id": 8384,
              "sizeKB": 45.92578125,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "PickleTensor"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "No Pickle imports",
              "virusScanResult": "Success",
              "scannedAt": "2023-02-07T17:05:48.272Z",
              "hashes": {
                "AutoV2": "A91B570185",
                "SHA256": "A91B570185766FF71F242F83D5BEB6D658348900EDB706A2092BA23D6E1E2CF8",
                "CRC32": "F874123A",
                "BLAKE3": "29322FB6F5E7C19E49F8C1CFEFE0C638BD47CF6BCE0778A7202F175816B4D26C"
              },
              "downloadUrl": "https://civitai.com/api/download/models/8387",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6b404ab7-c1f1-4c56-8df6-3a5871faa100/width=450/79565.jpeg",
              "nsfw": false,
              "width": 2026,
              "height": 2714,
              "hash": "U9D+h~I;R+oeOUEMxa-V00~VNHE200IAkCoz",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b1a654d8-0ece-4488-1689-1dbf33b3b200/width=450/79564.jpeg",
              "nsfw": false,
              "width": 2178,
              "height": 2506,
              "hash": "U797Lo~VM{WX004:t7oe^+%MWBWCWBaxayj]",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f21f7b7e-7431-484e-5079-4f1c6501f000/width=450/79563.jpeg",
              "nsfw": false,
              "width": 2472,
              "height": 2711,
              "hash": "U6CF#COsK5Sd01w]M|jF00xY-Sso~pEht5bH",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ad240caa-1c18-40d9-de17-2569775d8b00/width=450/79562.jpeg",
              "nsfw": false,
              "width": 2201,
              "height": 2047,
              "hash": "U4DIg?hyTKy?00TJVsvf00.8ofEL%fnit7kC",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/035cbefd-7770-424a-4a63-0ffb18dae200/width=450/79561.jpeg",
              "nsfw": false,
              "width": 1772,
              "height": 2047,
              "hash": "U7Bf;FxaIo%M00ayt7M{xuRjofof~qt8NGof",
              "meta": null
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1a9a83c6-faba-472e-77bf-c6d2f81da700/width=450/79560.jpeg",
              "nsfw": false,
              "width": 768,
              "height": 536,
              "hash": "U5H-_a~pE1WW00%LofR*kXD*t7t700D%bHof",
              "meta": {
                "ENSD": "31337",
                "Size": "640x448",
                "seed": 1133046487,
                "Score": "5.4",
                "steps": 20,
                "prompt": "photographic full body character turnaround of beautiful curvy redhead (Hildai17:0.8) (wearing a long white sundress:1.2). Multiple views of the same character in the same outfit. Photorealistic, subsurface scattering, photo real, 8k, hyperreal  <lora:mw_charturn3:.4> (15Charturn_longCap_D:.3)",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 4,
                "Clip skip": "2",
                "resources": [
                  {
                    "name": "mw_charturn3",
                    "type": "lora",
                    "weight": 0.4
                  }
                ],
                "Model hash": "777f034bc3",
                "Hires upscale": "1.2",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "naked, nude, boobs, nsfw, nipples, bad_prompt_version2, (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquid tongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missing breasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fusedears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears, fused animal ears, bad animal ears, poorly drawn animal ears, extra animal ears, liquid animal ears, heavy animal ears, missing animal ears, text, ui, error, missing fingers, missing limb, fused fingers, one hand with more than 5 fingers, one hand with less than 5 fingers, one hand with more than 5 digit, one hand with less than 5 digit, extra digit, fewer digits, fused digit, missing digit, bad digit, liquid digit, colorful tongue, blacktongue, cropped, watermark, username, blurry, JPEG artifacts, signature, 3D, 3D game, 3D game scene, 3D character, malformed feet, extra feet, bad feet, poorly drawn feet, fused feet, missing feet, extra shoes, bad shoes, fused shoes, more than two shoes, poorly drawn shoes, bad gloves, poorly drawn gloves, fused gloves, bad cum, poorly drawn cum, fused cum, bad hairs, poorly drawn hairs, fused hairs, big muscles, ugly, bad face, fused face, poorly drawn face, cloned face, big face, long face, badeyes, fused eyes poorly drawn eyes, extra eyes, malformed limbs, more than 2 nipples, missing nipples, different nipples, fused nipples, bad nipples, poorly drawnnipples, black nipples, colorful nipples, gross proportions. short arm, (((missing arms))), missing thighs, missing calf, missing legs, mutation, duplicate, morbid, mutilated, poorly drawn hands, more than 1 left hand, more than 1 right hand, deformed, (blurry), disfigured, missing legs, extra arms, extra thighs, more than 2 thighs, extra calf,fused calf, extra legs, bad knee, extra knee, more than 2 legs, bad tails, bad mouth, fused mouth, poorly drawn mouth, bad tongue, tongue within mouth, too long tongue, black tongue, big mouth, cracked mouth, bad mouth, dirty face, dirty teeth, dirty pantie, fused pantie, poorly drawn pantie, fused cloth, poorly drawn cloth, badpantie, yellow teeth, thick lips, bad camel toe, colorful camel toe, bad asshole, poorly drawn asshole, fused asshole, missing asshole, bad anus, bad pussy, bad crotch, bad crotch seam, fused anus, fused pussy, fused anus, fused crotch, poorly drawn crotch, fused seam, poorly drawn anus, poorly drawn pussy, poorly drawn crotch, poorly drawn crotch seam, bad thigh gap, missing thigh gap, fused thigh gap, liquid thigh gap, poorly drawn thigh gap, poorly drawn anus, bad collarbone, fused collarbone, missing collarbone, liquid collarbone, strong girl, obesity, worst quality, low quality, normal quality, liquid tentacles, bad tentacles, poorly drawn tentacles, split tentacles, fused tentacles, missing clit, bad clit, fused clit, colorful clit, black clit, liquid clit, QR code, bar code, censored, safety panties, safety knickers, beard, furry, pony, pubic hair, mosaic, futa, testis, (((deformed))), blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, (extra_limb), (ugly), (poorly drawn hands), fused fingers, messy drawing, broken legs censor, censored, censor_bar, multiple breasts, (mutated hands and fingers:1.5), (long body :1.3), (mutation, poorly drawn :1.2), black-white, bad anatomy, liquid body, liquid tongue, disfigured, malformed, mutated, anatomical nonsense, text font ui, error, malformed hands, long neck, blurred, lowers, low res, bad anatomy, bad proportions, bad shadow, uncoordinated body, unnatural body, fused breasts, bad breasts, huge breasts, poorly drawn breasts, extra breasts, liquid breasts, heavy breasts, missing breasts, huge haunch, huge thighs, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, fusedears, bad ears, poorly drawn ears, extra ears, liquid ears, heavy ears, missing ears, fused animal ears, bad animal ears, poorly drawn animal ears, extra animal ears, liquid animal ears, heavy animal ears, missing animal ears, text, ui, error, missing fingers, missing limb, fused fingers, one hand with more than 5 fingers, one hand with less than 5 fingers, one hand with more than 5 digit, one hand with less than 5 digit, extra digit, fewer digits, fused digit, missing digit, bad digit, liquid digit, colorful tongue, blacktongue, cropped, watermark, username, blurry, JPEG artifacts, signature, 3D, 3D game, 3D game scene, 3D character, malformed feet, extra feet, bad feet, poorly drawn feet, fused feet, missing feet, extra shoes, bad shoes, fused shoes, more than two shoes, poorly drawn shoes, bad gloves, poorly drawn gloves, fused gloves, bad cum, poorly drawn cum, fused cum, bad hairs, poorly drawn hairs, fused hairs, big muscles, ugly, bad face, fused face, poorly drawn face, cloned face, big face, long face, badeyes, fused eyes poorly drawn eyes, extra eyes, malformed limbs, more than 2 nipples, missing nipples, different nipples, fused nipples, bad nipples, poorly drawnnipples, black nipples, colorful nipples, gross proportions. short arm, (((missing arms))), missing thighs, missing calf, missing legs, mutation, duplicate, morbid, mutilated, poorly drawn hands, more than 1 left hand, more than 1 right hand, deformed, (blurry), disfigured, missing legs, extra arms, extra thighs, more than 2 thighs, extra calf,fused calf, extra legs, bad knee, extra knee, more than 2 legs, bad tails, bad mouth, fused mouth, poorly drawn mouth, bad tongue, tongue within mouth, too long tongue, black tongue, big mouth, cracked mouth, bad mouth, dirty face, dirty teeth, dirty pantie, fused pantie, poorly drawn pantie, fused cloth, poorly drawn cloth, badpantie, yellow teeth, thick lips, bad camel toe, colorful camel toe, bad asshole, poorly drawn asshole, fused asshole, missing asshole, bad anus, bad pussy, bad crotch, bad crotch seam, fused anus, fused pussy, fused anus, fused crotch, poorly drawn crotch, fused seam, poorly drawn anus, poorly drawn pussy, poorly drawn crotch, poorly drawn crotch seam, bad thigh gap, missing thigh gap, fused thigh gap, liquid thigh gap, poorly drawn thigh gap, poorly drawn anus, bad collarbone, fused collarbone, missing collarbone, liquid collarbone, worst quality, low quality, normal quality, liquid tentacles, bad tentacles, poorly drawn tentacles, split tentacles, fused tentacles, missing clit, bad clit, fused clit, colorful clit, black clit, liquid clit, QR code, bar code, censored, safety panties, safety knickers, beard, mosaic, futa, testis",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0b0550e6-1034-4b5b-63c7-e545545cfb00/width=450/79559.jpeg",
              "nsfw": false,
              "width": 816,
              "height": 816,
              "hash": "U5F;TjT1s.}q19bvoejF^QxDR*I=ZLenaeNw",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 1280899878,
                "Score": "6.29",
                "steps": 30,
                "prompt": "<lora:mw_charturn3:.1> (15Charturn_longCap_D:.4)  a character turnaround young male cyberpunk netrunner, (high detailed skin:1.2),  RAW photo. Human, cybernetic hands,  (Multiple views of the same character:1.2) (on the same background:1.1) , modelshoot style, nousr robot",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 5.5,
                "Clip skip": "2",
                "resources": [
                  {
                    "name": "mw_charturn3",
                    "type": "lora",
                    "weight": 0.1
                  }
                ],
                "Model hash": "847da9eead",
                "Hires upscale": "1.6",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "(naked:1), (military:1.2),",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d102e6a2-3f44-49ea-33ab-47633f090c00/width=450/79558.jpeg",
              "nsfw": false,
              "width": 816,
              "height": 608,
              "hash": "ULI50xs.%MIU~qt7ofWCMxofR*t7D%WCaxof",
              "meta": {
                "ENSD": "31337",
                "Size": "512x384",
                "seed": 254644189,
                "Score": "6.36",
                "steps": 30,
                "prompt": "(15Charturn_longCap_D:1)  a character turnaround of 30 y.o woman, red hair, short haircut, pale skin, (high detailed skin:1.2),  RAW photo.  (Multiple views of the same character:1.2) (on the same background:1.1), modelshoot style, nousr robot",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 5.5,
                "Clip skip": "2",
                "resources": [],
                "Model hash": "847da9eead",
                "Hires upscale": "1.6",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "(naked:1), (military:1.2), (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/aff87e58-f731-42dc-7838-cc811e7e4700/width=450/79557.jpeg",
              "nsfw": false,
              "width": 944,
              "height": 824,
              "hash": "U9Kw|Mae4n4o4no0t7Rj~qjt%M-;?bNGt7xu",
              "meta": {
                "ENSD": "31337",
                "Size": "512x448",
                "seed": 2719393072,
                "Score": "6.17",
                "steps": 30,
                "prompt": "(15Charturn_longCap_D:1) a character turnaround of A rat. Subsurface scattering, rimlight, (charturner:1). art by smoose2. Multiple views of the same character in the same outfit.   , ANALOG STYLE, MODELSHOOT STYLE, NSFW, NUDITY",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 8.5,
                "Clip skip": "2",
                "resources": [],
                "Model hash": "c35782bad8",
                "Hires upscale": "1.85",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "naked, nude, boobs, nsfw, nipples",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f8ff5342-06a4-4a72-aa5f-11762c417a00/width=450/79556.jpeg",
              "nsfw": false,
              "width": 944,
              "height": 944,
              "hash": "UEG[+o$*aet6D%RkjsoL~pxut7R*Rjayayj[",
              "meta": {
                "ENSD": "31337",
                "Size": "512x512",
                "seed": 3400864224,
                "Score": "5.87",
                "steps": 30,
                "prompt": "(15Charturn_longCap_D:1) a facial character turnaround of A (rat:1.3). fursona  Subsurface scattering, rimlight, (charturner:1). Covered with fur. Dark fur, art by smoose2. Multiple views of the same character in the same outfit.   , ANALOG STYLE, MODELSHOOT STYLE, NSFW, NUDITY",
                "sampler": "DDIM",
                "Eta DDIM": "0.16",
                "cfgScale": 8.5,
                "Clip skip": "2",
                "resources": [],
                "Model hash": "c35782bad8",
                "Hires upscale": "1.85",
                "Hires upscaler": "Latent (nearest-exact)",
                "negativePrompt": "hoodie, human, military, armor, boots, (naked:1.6), nude, boobs, nsfw, nipples",
                "Denoising strength": "0.7"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/8387"
        },
        {
          "id": 3334,
          "modelId": 3036,
          "name": "CharTurner V1 - For 1.5",
          "createdAt": "2022-12-28T23:21:25.362Z",
          "updatedAt": "2023-03-15T18:58:13.476Z",
          "trainedWords": ["charturner"],
          "baseModel": "SD 1.5",
          "earlyAccessTimeFrame": 0,
          "description": "<p>First version. Still has things I'm working on fixing. Adding \"multiple views of the same character\" can help if your character is being stubborn. </p>",
          "stats": {
            "downloadCount": 12424,
            "ratingCount": 23,
            "rating": 4.65
          },
          "files": [
            {
              "name": "charturner.pt",
              "id": 3231,
              "sizeKB": 12.9169921875,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "PickleTensor"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "**Detected Pickle imports (3)**\n```\ncollections.OrderedDict\ntorch.FloatStorage\ntorch._utils._rebuild_tensor_v2\n```",
              "virusScanResult": "Success",
              "scannedAt": "2022-12-28T23:28:40.051Z",
              "hashes": {
                "AutoV2": "733E24A8F4",
                "SHA256": "733E24A8F4F9741DF4C936380BE9F25DF2F79FACD23AB956E03F9D9F75872DFD",
                "CRC32": "45B06535",
                "BLAKE3": "E89566CFC12D5596C9F373838C58778DE9833AED6B23348FCA0EAEEBC18ACE32"
              },
              "downloadUrl": "https://civitai.com/api/download/models/3334",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1ade236c-eabe-4e9e-9719-37adaf55c300/width=450/22507.jpeg",
              "nsfw": false,
              "width": 768,
              "height": 768,
              "hash": "U8GRSVXmPU$*00n%IoI:BTxGn4Io?^ozxaso",
              "meta": {
                "Size": "768x768",
                "seed": 3644685645,
                "steps": 30,
                "prompt": "highly detailed Full body charturner of a postman. multiple views of the same character.  . Subsurface scattering, rimlight,, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 8.5,
                "Model hash": "993f52a4",
                "negativePrompt": "woman, girl, toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x512",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0cd2ed10-3582-40e5-8b4f-0612f6841400/width=450/22516.jpeg",
              "nsfw": false,
              "width": 768,
              "height": 768,
              "hash": "UNIX~zofRj?bxbofayay~qoetRV@%gaeofof",
              "meta": {
                "Size": "768x768",
                "seed": 355585046,
                "steps": 30,
                "prompt": "highly detailed Full body of character turnaround of a mailman. multiple views of the same character.  . Subsurface scattering, rimlight, charturner, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 8.5,
                "Model hash": "993f52a4",
                "negativePrompt": "orange, woman, girl, toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x512",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1aa3e6e1-316f-4da7-3d9c-1f5934d11900/width=450/22515.jpeg",
              "nsfw": false,
              "width": 896,
              "height": 576,
              "hash": "UBGbYZ-pbIIowJWBR+t6~qoft7aeW=j[V@jY",
              "meta": {
                "Size": "896x576",
                "seed": 2294001164,
                "steps": 30,
                "prompt": "a 2d character turnaround of A rat.  Subsurface scattering, rimlight, (charturner:1)., art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 10.5,
                "Model hash": "993f52a4",
                "negativePrompt": "toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x320",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b76df236-a854-434e-d78e-e876ca2a0900/width=450/22514.jpeg",
              "nsfw": false,
              "width": 896,
              "height": 576,
              "hash": "U8GbSK^+00IA00kB-;?b~WITxvMy00RkRPe-",
              "meta": {
                "Size": "896x576",
                "seed": 2294001167,
                "steps": 30,
                "prompt": "a 2d character turnaround of A rat.  Subsurface scattering, rimlight, (charturner:1)., art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 10.5,
                "Model hash": "993f52a4",
                "negativePrompt": "toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x320",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d4bebcee-7be0-4595-3c98-93eb46460600/width=450/22513.jpeg",
              "nsfw": false,
              "width": 896,
              "height": 576,
              "hash": "U8Fg@2%2s-s:DlS~NGS2NdR*OER+{dnNofWV",
              "meta": {
                "Size": "896x576",
                "seed": 2760083340,
                "steps": 30,
                "prompt": "a character turnaround of a curvy redheaded pinup girl(Hildai17:0.8).  Subsurface scattering, rimlight, (charturner:1)., art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 10.5,
                "Model hash": "993f52a4",
                "negativePrompt": "toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x320",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fcfed606-93b1-4d8c-451c-b2a378d70500/width=450/22512.jpeg",
              "nsfw": false,
              "width": 1024,
              "height": 768,
              "hash": "UKGuq9$%Mxxt?Hs:t7j[_NWqt8f+RkWBRjae",
              "meta": {
                "Size": "1024x768",
                "seed": 2094869509,
                "steps": 30,
                "prompt": "highly detailed Full body Character turnaround of a evil badger mage. front, side, back,  multiple views of the same character.  charturner. Subsurface scattering, rimlight, pouches and herbs. Highly detailed soft clumpy fur, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 15.5,
                "Model hash": "993f52a4",
                "negativePrompt": "toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "576x448",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3e1128ee-1d06-4923-5ffb-ee989762ad00/width=450/22511.jpeg",
              "nsfw": false,
              "width": 1024,
              "height": 768,
              "hash": "UEE:0poz%gaKaKWVWBn%~qt7WBoLazRPRjV@",
              "meta": {
                "Size": "1024x768",
                "seed": 767967615,
                "steps": 30,
                "prompt": "highly detailed Full body Character turnaround of a male ninja. front, side, back,  multiple views of the same character.  charturner. Subsurface scattering, rimlight,, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 7.5,
                "Model hash": "993f52a4",
                "negativePrompt": "woman, girl, toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "576x448",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/badde49e-83e2-4a5d-bb68-b19847242e00/width=450/22510.jpeg",
              "nsfw": false,
              "width": 1024,
              "height": 768,
              "hash": "UAD]PV%gsp?v~qn$R*Rj?vn$W;V@%MR*n%j[",
              "meta": {
                "Size": "1024x768",
                "seed": 555145518,
                "steps": 30,
                "prompt": "Full body Character turnaround of a evil badger mage. front, side, back,  multiple views of the same character.  charturner, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 10,
                "Model hash": "993f52a4",
                "negativePrompt": "toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "576x448",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e64532fb-142f-4a56-1d87-56efdec04800/width=450/22509.jpeg",
              "nsfw": false,
              "width": 768,
              "height": 768,
              "hash": "U8G+tBRjx]0000ozR*%M~qo#Rj%g%hM{RPxv",
              "meta": {
                "Size": "768x768",
                "seed": 2373222042,
                "steps": 30,
                "prompt": "highly detailed Full body of character turnaround of a robot paper boy. multiple views of the same character in the same outfit. Subsurface scattering, rimlight, charturner, art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 8.5,
                "Model hash": "993f52a4",
                "negativePrompt": "orange, woman, girl, toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x512",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a8d05704-751f-4d8e-ab4b-3be5b50c5400/width=450/22508.jpeg",
              "nsfw": false,
              "width": 896,
              "height": 576,
              "hash": "UBHL3poM9Fiv~VWXNGt7SKV@WBof$j?V@nO",
              "meta": {
                "Size": "896x576",
                "seed": 2936119404,
                "steps": 30,
                "prompt": "Full body of character turnaround of a (kitten animal :1.1). highly detailed  front, back, side, 3/4 (multiple views:1.1) of the (same character :1.1)in the same outfit. Subsurface scattering, rimlight, (charturner:1.3)., art by smoose2",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 10.5,
                "Model hash": "993f52a4",
                "negativePrompt": "humanoid, woman, girl, toy, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ((((mutated hands and fingers)))), (((out of frame))), cartoon, 3d, (disfigured), (bad art), (deformed), (poorly drawn), (extra limbs), strange colours, blurry, boring, sketch, lacklustre, repetitive, cropped, hands",
                "First pass size": "512x320",
                "Denoising strength": "0.7"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/3334"
        }
      ]
    },
    {
      "id": 4514,
      "name": "Pure Eros Face",
      "description": "<p>This embedding will generate <strong>good-looking girl faces</strong>, close concept of <strong><u>kpop idols or Instagram girls</u></strong>. For <strong>SD1.5</strong> based models.</p><p></p><p><em>what means \"Pure Eros\"?</em></p><p><em>&gt; Pure Eros is a simple translation of the Chinese word \"</em><strong><em>纯欲</em></strong><em>\", which is a popular memes in the Chinese internet, the english words close to the semantics of this word are \"ulzzang face\", \"korean idol face\", so obviously this embedding will be close to the Asian aesthetic.🤗</em></p><p></p><p><strong>Recommended config:</strong></p><p>1. prompt</p><ul><li><p><strong>[:(detailed face:1.2):0.2]</strong>: When drawing high-quality faces, do not use the \"detail face\" tag at 0 steps, otherwise it may lead to deviation from the original semantics of embedding</p></li><li><p><strong>shiny eyes, looking at viewer</strong>: If your generated faces often close their eyes, adding \"shiny eyes, looking at viewer\" will open them instantly</p></li></ul><p>2. negative prompt:</p><ul><li><p><strong>long hair</strong>: add it to fix some errors caused by training data bias...(<em>although it does not always affect the output, my experiments found that it seems that the length of the hair in a certain scene will affect the quality of the clothes. In short, the relationship is very subtle, you can try to control the length of the hair to change the outfit quality)</em></p></li><li><p><strong>full body</strong>: Most of the data set is close-up, so it doesn't perform well on the \"full body\" scene, <em>I'm trying to fix it in the next version</em></p></li><li><p><strong>disabled body</strong>: If a deformed body structure is produced, please add it</p></li><li><p><strong>DeepNegative</strong>: A negative embedding I released can be used with PureErosFace very well, it is recommended to try</p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/4629/deep-negative-v1x\">https://civitai.com/models/4629/deep-negative-v1x</a></p></li></ul><p></p><p></p><p><strong>Recommended model:</strong></p><p>It is best to use a model with a realistic style. If it is an anime-style model, it may output a mask-like face.</p><p></p><p><strong>1. LOFI</strong></p><p>merged model I released, works fine with this embedding</p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/9052/lofi\">https://civitai.com/models/9052/lofi</a></p><img src=\"https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/8e1c68da-4e15-49bf-0090-25a89a438800/width=525\" /><p></p><p>examples <a target=\"_blank\" rel=\"ugc\" href=\"https://imgur.com/a/nFRE1Z4.jpg\">https://imgur.com/a/nFRE1Z4.jpg</a></p><img src=\"https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/29349082-39d2-45bf-4221-b49134ba3000/width=525\" /><p></p><p>2. <strong>izumi</strong></p><p>Most of my example images are generated by izumi:</p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/1364/izumi\">https://civitai.com/models/1364/izumi</a></p><p></p><p>examples and test: <a target=\"_blank\" rel=\"ugc\" href=\"https://imgur.com/ZirqVWK.jpg\">https://imgur.com/ZirqVWK.jpg</a></p><img src=\"https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9c53760b-fce1-4c3a-0339-d7f393e0d800/width=525\" /><p></p><p>3. <strong>F222</strong></p><p>Also produced a good-looking face, although I only experimented with a few, but they all look good for work</p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/1188/f222\">https://civitai.com/models/1188/f222</a></p><p></p><p>examples and test: <a target=\"_blank\" rel=\"ugc\" href=\"https://imgur.com/ixyVXTP.jpg\">https://imgur.com/ixyVXTP.jpg</a></p><img src=\"https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/711d2fde-6c76-4702-b392-23f79d1ebe00/width=525\" /><p></p><p>4. <strong>HassanBlend</strong></p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/1173/hassanblend-1512-and-previous-versions\">https://civitai.com/models/1173/hassanblend-1512-and-previous-versions</a></p><p></p><p>examples and test: <a target=\"_blank\" rel=\"ugc\" href=\"https://imgur.com/no066sF.jpg\">https://imgur.com/no066sF.jpg</a></p><img src=\"https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/885d0191-ba9f-4001-7693-6e56ff3adc00/width=525\" /><p></p><p><strong>my discord server, find me here:</strong></p><p><a target=\"_blank\" rel=\"ugc\" href=\"https://discord.gg/v5HFg47J6U\"><strong>https://discord.gg/v5HFg47J6U</strong></a></p><p><strong>-</strong></p>",
      "type": "TextualInversion",
      "poi": false,
      "nsfw": true,
      "allowNoCredit": false,
      "allowCommercialUse": "Rent",
      "allowDerivatives": true,
      "allowDifferentLicense": false,
      "stats": {
        "downloadCount": 66498,
        "favoriteCount": 8427,
        "commentCount": 38,
        "ratingCount": 50,
        "rating": 4.9
      },
      "creator": {
        "username": "FapMagi",
        "image": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/625d4b36-c648-4a5d-5282-f35fe7cdd100/width=96/FapMagi.jpeg"
      },
      "tags": [
        "girl",
        "person",
        "photorealistic",
        "textual inversion",
        "beauties",
        "asian",
        "kpop",
        "woman",
        "faces",
        "girls",
        "photography",
        "portraits",
        "realistic"
      ],
      "modelVersions": [
        {
          "id": 5119,
          "modelId": 4514,
          "name": "PureErosFace_v1",
          "createdAt": "2023-01-14T12:01:59.609Z",
          "updatedAt": "2023-02-24T03:35:55.300Z",
          "trainedWords": ["pureerosface_v1"],
          "baseModel": "SD 1.5",
          "earlyAccessTimeFrame": 0,
          "description": "<p>Training Config:</p><p>initialization text: ulzzang face,kpop idol</p><p>number of vectors per token: 1</p><p>lr: 0.05:10, 0.02:20, 0.01:60, 0.005:200, 0.002:500, 0.001:3000, 0.0005</p><p>(Here is not the complete lr formula, because I manually selected several iterations as branches during training, but I did not record it completely...here is just a part)</p><p>batch size: 10</p><p>images: 100+ images (close-up portrait girl face)</p><p>size: 512x512</p><p>steps: 1000</p>",
          "stats": {
            "downloadCount": 66504,
            "ratingCount": 50,
            "rating": 4.9
          },
          "files": [
            {
              "name": "pureerosface_v1.pt",
              "id": 5162,
              "sizeKB": 3.9169921875,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "PickleTensor"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "**Detected Pickle imports (3)**\n```\ntorch.FloatStorage\ntorch._utils._rebuild_tensor_v2\ncollections.OrderedDict\n```",
              "virusScanResult": "Success",
              "scannedAt": "2023-01-14T12:09:02.454Z",
              "hashes": {
                "AutoV2": "DEDB4322E4",
                "SHA256": "DEDB4322E42E360FE01775BA817BE03AC6A6C307744562BB0D6759368BC681DA",
                "CRC32": "8E3194F8",
                "BLAKE3": "7F529ED966666F01C58DE4576421C8A2FB438F82043CEBABD976CF8ECF4D308A"
              },
              "downloadUrl": "https://civitai.com/api/download/models/5119",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9fbf8bf0-aad7-4360-eeb0-3e2e09628900/width=450/110973.jpeg",
              "nsfw": true,
              "width": 512,
              "height": 768,
              "hash": "UIG,eU~qYPAb-VITysoy00IVwJr??a$*IAS$",
              "meta": {
                "Size": "256x384",
                "seed": 2430721844,
                "steps": 15,
                "prompt": "symmetrical,High detail RAW color photo professional close photograph,\n[:(highly detail face: 1.2):0.1], (PureErosFace_V1:0.8), twintails, half body, pore, real human skin,\n\na portrait of a 18yo woman bathing in a river,body contact water and ripple around,\nreeds,clear and clean water,\nshiny eyes,looking at viewer,\nwearing tight sports top, wet clothes, see-through clothes, nipples, wet body, wet hair,\n\ntindal effect,lens flare,shade, bloom,\nbacklighting, depth of field, natural lighting, hard focus, film grain, photographed with a Sony a9 II Mirrorless Camera, by Laurence Demaison",
                "sampler": "Euler a",
                "cfgScale": 7,
                "resources": [],
                "Model hash": "959205938e",
                "Hires steps": "40",
                "Hires upscale": "2",
                "Hires upscaler": "Latent",
                "negativePrompt": "NG_DeepNegative_V1_75T,\n disabled body,extra head,extra person,duplicate, copy, cropped,\nlowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, crown, hat, chromatic aberration, child",
                "Denoising strength": "0.7"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fbd0cb59-8730-4a2f-120f-3a0f06e1e000/width=450/39166.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UDJG+t170$~p}]=}0gXUXS#RRQtS0f-p-pNb",
              "meta": {
                "seed": 1689791114,
                "steps": 40,
                "prompt": "symmetrical,High detail RAW color photo professional close photograph,\n[:(highly detail face: 1.2):0.1], PureErosFace_V1, twintails，\n\na portrait of a 18yo woman bathing in a river,body contact water and ripple around,\nreeds,clear and clean water,\nshiny eyes,looking at viewer,\nwearing tight sports top, wet clothes, see-through clothes, nipples, wet body, wet hair,\n\ntindal effect,lens flare,shade, bloom,\nbacklighting, depth of field, natural lighting, hard focus, film grain, photographed with a Sony a9 II Mirrorless Camera, by Laurence Demaison",
                "sampler": "Euler a",
                "cfgScale": 7,
                "negativePrompt": " disabled body,extra head,extra person,duplicate, copy, cropped,\nlowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, crown, hat, chromatic aberration, child"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/bde04434-d879-4f9f-63e7-e7f125b63e00/width=450/38248.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UOH13|}@D%IU6MFax[X7=exF$g%2t5wdoKof",
              "meta": {
                "Size": "512x768",
                "seed": 633455752,
                "steps": 40,
                "prompt": "dark late at night,mid-night,(symmetry:1.1),\n\n(highly detailed face:1.1),PureErosFace_v1,(short hair:1.1), \nclosed up portrait of an elegant girl wearing gorgeous red flower kimono and flower in hair,21yo girl,\n\nnighttown,(fireworks display:1.2),blurry background,\nperspective,(half_body:1.1),\n\nhighly detailed, sharp focus, 8k,natural light,lens 135mm,f1.8,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e8409490-308a-4a19-8d6b-e987574e9000/width=450/38241.jpeg",
              "nsfw": true,
              "width": 512,
              "height": 768,
              "hash": "UIGkI5Os0JE1OTRQ#;xbH?RQ?Ho}~BJ7xGni",
              "meta": {
                "Size": "512x768",
                "seed": 2082299184,
                "steps": 40,
                "prompt": "(dark late at night,mid-night:1.1),(symmetry:1.1),\n\n(highly detailed face:1.1),PureErosFace_v1,(short hair:1.1), \nclosed up portrait of an elegant girl wearing gorgeous red flower kimono and flower in hair,21yo girl,\n\n(fireworks background:1.1),blurry background,\nperspective,(half_body:1.1),\n\nhighly detailed, sharp focus, 8k,natural light,lens 135mm,f1.8,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/48e7d790-4366-41fb-de54-9448c28c1200/width=450/38243.jpeg",
              "nsfw": true,
              "width": 512,
              "height": 768,
              "hash": "UJJRHg?I9EWX00MyO-M|4-IV%gNG*Ibc$yxa",
              "meta": {
                "Size": "512x768",
                "seed": 2628228709,
                "steps": 40,
                "prompt": "(symmetry!:1.2),(half_body:1.1),\n\ntwintails,24yo girl,(short hair:1.1), [:big breasts:0.5],\nPureErosFace_v1, [:(detailed face:1.1):0.1],\nvisible navel,Clearly visible pores, real skin texture,\n(shiny eyes:1.1),(looking at viewer, facing viewer:1.1),\navocado green clothes,exposed half breasts, \ntight [qipao:yoga clothing:0.5],outdoors,\n\ndepth of field,blurry background,natural light,\ntelephoto lens, soft focus, 8k canon RAW, art photography,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,(disabled body:1.1),(closed eyes:1.2), \nmissing hand, missing arms,back to viewer,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e3c1055a-b9bb-4c57-428f-69206f8a2300/width=450/38247.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UOJtYs_35*x]0{XA?I%MtTW@-:ox~qxuRjV@",
              "meta": {
                "Size": "512x768",
                "seed": 245553777,
                "steps": 50,
                "prompt": "(symmetry:1.2),(half_body:1.2),(highly detailed face:1.2)\n\nPureErosFace_v1,24yo girl,wearing see-through light_pink tight sports top,\nportrait of face, running motion,\ndusk in middle of a crowd in the street market fair, (at noon),\nd750 hdr color photo by Relja Penezic, rim halo light, soft focus, flare, telephoto lens, kodak portra",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "(bad_prompt_version2:0.8),\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dec6d254-1f37-4dcd-8f16-353e370f9600/width=450/38244.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UYJHR8~pEL_3NHx].8xuD%WBt6RPWBaxt7t7",
              "meta": {
                "Size": "512x768",
                "seed": 4204041621,
                "steps": 40,
                "prompt": "(symmetry!:1.2),facing viewer,\n(half_body:1.1),\n\ntwintails,24yo girl,(short hair:1.1), \nPureErosFace_v1, [:(detailed face:1.1):0.3],shiny eyes,looking at viewer, \n(wedding dress,bridal veil|(qipao:1.2)),indoors,\n\ndepth of field,blurry background,\ntelephoto lens, soft focus, 8k canon RAW, art photography,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,disabled body,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/869b8476-0213-49a3-e1cc-7ba591bed200/width=450/38242.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UKGtNf=d56%2vz}@-pJ7$l$ls:9t0gIXR--o",
              "meta": {
                "Size": "512x768",
                "seed": 1563306171,
                "steps": 40,
                "prompt": "(dark late at night,mid-night:1.2),(symmetry:1.2),\nperspective,(half_body:1.1),(highly detailed face:1.1),\n(night fireworks background:1.1),blurry background,\n(facing viewer,looking at viewer:1.1),\n\nPureErosFace_v1,(short hair:1.1),\nportrait of an elegant 21yo girl wearing pink flower kimono and cute flower in hair,\n\nhighly detailed, sharp focus, 8k,natural light,lens 135mm,f1.8,art photography,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7061f7bd-6425-47da-d5a6-b0c91e189800/width=450/38246.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UMI|wDo|-:?GR~t7wcNG~UoJNeRj=xt79Zt6",
              "meta": {
                "Size": "512x768",
                "seed": 2540924381,
                "steps": 40,
                "prompt": "(symmetry!:1.2),facing viewer,\n(half_body:1.1),\n\nhazel eyes caramel,twintails,24yo girl,(short hair:1.1), \nPureErosFace_v1, [:(detailed face:1.2):0.3]\nwedding dress,indoors,bridal veil,\n\ndepth of field,blurry background,\ntelephoto lens, soft focus, 8k canon RAW, art photography,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7561317-9bf0-4e86-d484-e5d8b2d30000/width=450/38245.jpeg",
              "nsfw": false,
              "width": 512,
              "height": 768,
              "hash": "UDKmw#8_Dh8_0Kr?~qSO9F-V~WoIyDNbMcIo",
              "meta": {
                "Size": "512x768",
                "seed": 725376857,
                "steps": 40,
                "prompt": "(symmetry!:1.2),facing viewer,\n(half_body:1.1),\n\ntwintails,24yo girl,(short hair:1.1), \nPureErosFace_v1, [:(detailed face:1.1):0.3],shiny eyes,\n(wedding dress,bridal veil|(qipao:1.2)),indoors,\n\ndepth of field,blurry background,\ntelephoto lens, soft focus, 8k canon RAW, art photography,",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Model hash": "c785dff0",
                "negativePrompt": "nsfw,nude,nipples,plant,full_body,bad_prompt_version2,day,sunlight,long hair,\nextra limbs, extra arms, extra hands, extra fingers, extra legs, extra digit, deformed limbs, deformed arms, deformed hands, deformed fingers, deformed legs, deformed digit, malformed limbs, malformed arms, malformed hands, malformed fingers, malformed legs, malformed digit, fused limbs, fused arms, fused hands, fused fingers, fused legs, fused digit, mutated limbs, mutated arms, mutated hands, mutated fingers, mutated legs, mutated digit, mutilated limbs, mutilated arms, mutilated hands, mutilated fingers, mutilated legs, mutilated digit, fewer limbs, fewer arms, fewer hands, fewer fingers, fewer legs, fewer digit, disconnected limbs, disconnected arms, disconnected hands, disconnected fingers, disconnected legs, disconnected digit, missing limbs, missing arms, missing hands, missing fingers, missing legs, missing digit, poorly drawn limbs, poorly drawn arms, poorly drawn hands, poorly drawn fingers, poorly drawn legs, poorly drawn digit,child, child like"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/5119"
        }
      ]
    },
    {
      "id": 8109,
      "name": "Ulzzang-6500 (Korean doll aesthetic)",
      "description": "<h2>The OG Korean doll-aesthetic mod for Stable Diffusion</h2><p><strong>Donate for civilians in Ukraine, Syria, Mali etc.: </strong><a target=\"_blank\" rel=\"ugc\" href=\"https://www.icrc.org/en/donate\"><strong>Red Cross</strong></a><strong> | </strong><a target=\"_blank\" rel=\"ugc\" href=\"https://donate.doctorswithoutborders.org/secure/donate\"><strong>Doctors without Borders</strong></a><strong> | </strong><a target=\"_blank\" rel=\"ugc\" href=\"https://www.directrelief.org/\"><strong>DirectRelief</strong></a><strong> | </strong><a target=\"_blank\" rel=\"ugc\" href=\"https://www.feedthechildren.org/\"><strong>Feed The Children</strong></a></p><p>Slava Ukraini</p><p>___</p><p><em>» I like to use \"Ulzzang-6500\" embeddings (I used that for all sample images).This is my type....I couldn't avoid generating with this.... «</em></p><p>-Tasuku, who made <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/6424/chilloutmix\">ChilloutMix</a></p><p></p><p>Works best for <strong>semirealism</strong> and <strong>photorealism</strong>, but most likely only on SD 1.x (tested on 1.4 and 1.5). Is often used in combination with the <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/6424/chilloutmix\">ChilloutMix</a> and <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/8281/aom2h-basilmix\">aom2h-basilmix</a>. No bias in terms of eye and hair color and also not mimicking an individual person! Also handles angles well, you can throw pretty much anything at it and use it for inpainting of the face as well. There is a significant bias towards pale skin, as a heads up.</p><h3><strong>How to use</strong></h3><p>Simply download and put into your /embeddings folder in the Automatic1111 folder. Then use 'ulzzang-6500' in your prompt. Reduce or increase the weight of the embedding by using this syntax:</p><p>(ulzzang-6500:1.2) increases the weight, or values below 1 to decrease (such as 0.8)</p><p>I recommend putting ulzzang-6500 towards the end of the prompt, it's strong enough.</p><p><strong>Inpainting</strong></p><p>Another useful approach with this model is to inpaint on top of already existing images that were generated without the embedding if you want to see how they look with the ulzzang face.</p><p>In Automatic1111, on the img2img tab -&gt; Inpaint tab paint over the face (you can include the hair as well). Then describe that specific masked area in the prompt, which means that you should remove \"bad hands\" or \"perfect body\" from the prompt.</p><p>Select \"Inpaint only masked area\" and set the steps to around 70 (this is important, inpainting and img2img require higher step counts). Set the denoising strength to 0.4 to 0.75. The more closely the existing face resembles the ulzzang aesthetic the lower you can set this value. Set the resolution to 512x512, this is plenty for the face region.</p><h3><strong>Note on the concept</strong></h3><p>The embedding is neither intended to provoke childish features (the 'doll-like' refers to an uncanny level of supposed beauty standards, like a slim nose, aegyo sal and tear-drop chin) nor does it have a bias towards them from my testing. If the face in a generation should appear too young that's a bias from the latent model and can be countered by adding 'loli' and 'child' to the negative prompt.</p><p>For the LORA fans there is a similar model as well named Korean doll.</p><p>V1 demo image by <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/gallery/78258\"><strong>yatagarasu</strong></a>, second one by me, third one by <a target=\"_blank\" rel=\"ugc\" href=\"https://civitai.com/models/8281/aom2h-basilmix\"><strong>Bloodsuga</strong></a></p><p>V1.1 images by me</p>",
      "type": "TextualInversion",
      "poi": false,
      "nsfw": true,
      "allowNoCredit": true,
      "allowCommercialUse": "Rent",
      "allowDerivatives": true,
      "allowDifferentLicense": true,
      "stats": {
        "downloadCount": 78057,
        "favoriteCount": 7864,
        "commentCount": 56,
        "ratingCount": 38,
        "rating": 4.95
      },
      "creator": {
        "username": "festival",
        "image": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1cde28d2-3b4e-4b35-219e-35863ac1d100/width=96/festival.jpeg"
      },
      "tags": [
        "girl",
        "person",
        "photorealistic",
        "sexy",
        "female",
        "textual inversion",
        "asian",
        "ulzzang",
        "woman",
        "embedding",
        "faces",
        "girls",
        "korean",
        "portraits",
        "realistic"
      ],
      "modelVersions": [
        {
          "id": 10107,
          "modelId": 8109,
          "name": "v1.1",
          "createdAt": "2023-02-13T18:41:53.579Z",
          "updatedAt": "2023-02-23T18:08:51.680Z",
          "trainedWords": ["ulzzang-6500-v1.1"],
          "baseModel": "SD 1.4",
          "earlyAccessTimeFrame": 0,
          "description": "<p>Changed weights, should produce cleaner faces and be more close to the prompt. Test both embeddings and see which one works better, this one probably will improve the image in 3 out of 5 cases.</p>",
          "stats": {
            "downloadCount": 73361,
            "ratingCount": 29,
            "rating": 4.93
          },
          "files": [
            {
              "name": "ulzzang-6500-v1.1.bin",
              "id": 9682,
              "sizeKB": 9.9462890625,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "Other"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "No Pickle imports",
              "virusScanResult": "Success",
              "scannedAt": "2023-02-13T18:46:05.843Z",
              "hashes": {
                "AutoV2": "8C1AF299C7",
                "SHA256": "8C1AF299C7E8C2283892A7AD61A5FE5574E88C9C2EE77CD0CDFC0615155FA315",
                "CRC32": "F80635F8",
                "BLAKE3": "3FD8439086F0B32982EB736BC0F9BE220BC28562C98559C3DF13CD0ADA32D604"
              },
              "downloadUrl": "https://civitai.com/api/download/models/10107",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0bf5ee92-9c61-42a4-7ec4-f166738b6800/width=450/98566.jpeg",
              "nsfw": true,
              "width": 792,
              "height": 1096,
              "hash": "UNH.E4~qNq9t^%XTS~%M?c%g-;xt.A-;V[WB",
              "meta": {
                "ENSD": "-1",
                "Size": "512x712",
                "seed": 3671048516,
                "steps": 29,
                "prompt": "best quality, ultra high res, (photorealistic:1.4), 1 girl, looking at viewer, ulzzang-6500-v1.1",
                "sampler": "Euler a",
                "cfgScale": 7,
                "resources": [],
                "Model hash": "95afa0d9ea",
                "Hires steps": "30",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent",
                "negativePrompt": "paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), manboobs, backlight, double navel, mutad arms, hused arms, light",
                "Denoising strength": "0.6"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cc8b88a4-6ca8-45be-ddad-a54b9fc22600/width=450/98565.jpeg",
              "nsfw": true,
              "width": 768,
              "height": 1112,
              "hash": "UEF$6IxE9Z~q4nE2I9s9-;Mwr=-;WB^+_3bc",
              "meta": {
                "ENSD": "-1",
                "Size": "512x512",
                "seed": 3536241935,
                "steps": 27,
                "prompt": "[model = dalcefo paint v3] masterpiece, realistic, realistic lighting, painting, 1girl, arousing, lewd, ecchi, bust, dalcefo, jewelry, small breasts, cleavage cutout, live in wild, depth of field, cinematic angle, ulzzang-6500-v1.1",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 7,
                "Mask blur": "4",
                "resources": [],
                "Model hash": "dce6b18d01",
                "negativePrompt": "(worst quality, low quality:1.4), blurry, loli, child",
                "Denoising strength": "0.45"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/39e5753e-c772-41a1-15e2-4a7b218a7600/width=450/98564.jpeg",
              "nsfw": true,
              "width": 792,
              "height": 1096,
              "hash": "UDJHH*~W00IA00V@-pWBt,D%%2xaAdxZIoWB",
              "meta": {
                "ENSD": "-1",
                "Size": "512x712",
                "seed": 350504261,
                "steps": 29,
                "prompt": "best quality, ultra high res, (photorealistic:1.4), 1 girl, looking at viewer, ulzzang-6500-v1.1",
                "sampler": "Euler a",
                "cfgScale": 7,
                "resources": [],
                "Model hash": "95afa0d9ea",
                "Hires steps": "30",
                "Hires upscale": "1.55",
                "Hires upscaler": "Latent",
                "negativePrompt": "paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), manboobs, backlight, double navel, mutad arms, hused arms, light",
                "Denoising strength": "0.6"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/10107"
        },
        {
          "id": 9573,
          "modelId": 8109,
          "name": "1.0",
          "createdAt": "2023-02-12T00:07:29.189Z",
          "updatedAt": "2023-02-23T18:08:51.680Z",
          "trainedWords": [],
          "baseModel": "SD 1.4",
          "earlyAccessTimeFrame": 0,
          "description": null,
          "stats": {
            "downloadCount": 4698,
            "ratingCount": 11,
            "rating": 5
          },
          "files": [
            {
              "name": "ulzzang-6500.pt",
              "id": 9270,
              "sizeKB": 9.9169921875,
              "type": "Model",
              "metadata": {
                "fp": "fp16",
                "size": "full",
                "format": "PickleTensor"
              },
              "pickleScanResult": "Success",
              "pickleScanMessage": "No Pickle imports",
              "virusScanResult": "Success",
              "scannedAt": "2023-02-12T00:10:58.393Z",
              "hashes": {
                "AutoV2": "66D481A222",
                "SHA256": "66D481A222EE4638E254A411890F2A8716E4CE5C3E1B1957891C7628BBDEAC78",
                "CRC32": "AFF65BC0",
                "BLAKE3": "19FD55C3765AD09F190EEFE0F8F4F67C8CB2C3BEC8E7CF104489BC3746A21CC4"
              },
              "downloadUrl": "https://civitai.com/api/download/models/9573",
              "primary": true
            }
          ],
          "images": [
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b97d99de-8d00-482b-e828-75b6c43a7400/width=450/97833.jpeg",
              "nsfw": true,
              "width": 768,
              "height": 1112,
              "hash": "UGF=t1s99Z_N4-ELI9nOxuMd$%-;ay?b?vIp",
              "meta": {
                "seed": 3536241935,
                "steps": 27,
                "prompt": "[model = dalcefo paint v3] masterpiece, realistic, realistic lighting, painting, 1girl, arousing, lewd, ecchi, bust, dalcefo, jewelry, small breasts, cleavage cutout, live in wild, depth of field, cinematic angle, ulzzang-6500",
                "sampler": "DPM++ 2M Karras",
                "cfgScale": 7,
                "negativePrompt": "(worst quality, low quality:1.4), blurry, loli, child"
              }
            },
            {
              "url": "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6f08c2fe-105f-4e7d-4ea9-7de1d351ec00/width=450/97299.jpeg",
              "nsfw": true,
              "width": 1024,
              "height": 1536,
              "hash": "UAIzh$IB00~W0eXmpH9tJPVtNaxaDPaKt8xu",
              "meta": {
                "ENSD": "31337",
                "Size": "512x768",
                "seed": 3219398508,
                "Model": "AOM2H+BasilMix(50-50)",
                "steps": 25,
                "prompt": "ulzzang-6500, ultra realistic 8k cg, unparalleled masterpiece, absurdres, extraordinary, incredible, exquisite, sensational, perfect artwork, perfect female figure, perfect anatomy, unique, sexy, mature female, solo, very long hair, multicolored hair, huge breasts, looking at viewer, aesthetic, spectacular, splendid, superb, grand, astounding, stunning, magnificent, elegant, graceful, luxury, jewelry, gem, glint, beautiful, gorgeous, charismatic, charming, alluring, erotic, seductive, gothic, fantasy, divine, clean, rich, prestige, fantastic, supreme, apex, paramount, goddess, lace, lace trim, delicate pattern, shiny skin, gold, royal, queen, supernatural, phenomenal, fabulous, marvelous, stupendous, terrific, ((nsfw, breasts out, nipples, puffy nipples))",
                "sampler": "Euler a",
                "cfgScale": 7,
                "Clip skip": "2",
                "resources": [
                  {
                    "hash": "5cec660d69",
                    "name": "AOM2H+BasilMix(50-50)",
                    "type": "model"
                  }
                ],
                "Model hash": "5cec660d69",
                "Hires upscale": "2",
                "Hires upscaler": "R-ESRGAN 4x+",
                "negativePrompt": "(worst quality, low quality:1.2), username, watermark, signature, text",
                "Denoising strength": "0.5"
              }
            }
          ],
          "downloadUrl": "https://civitai.com/api/download/models/9573"
        }
      ]
    }
  ],
  "metadata": {
    "totalItems": 1676,
    "currentPage": 1,
    "pageSize": 3,
    "totalPages": 559,
    "nextPage": "https://civitai.com/api/v1/models?limit=3&types=TextualInversion&page=2"
  }
}
````
