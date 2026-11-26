# Local semantic runtime

- Model: Xenova/paraphrase-multilingual-MiniLM-L12-v2, q8 ONNX conversion of sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2, Apache-2.0. https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2
- Transformers.js 3.8.1, Apache-2.0. https://github.com/huggingface/transformers.js
- ONNX Runtime Web (bundled in Transformers.js), MIT, Copyright Microsoft Corporation. https://github.com/microsoft/onnxruntime/blob/main/LICENSE

All inference runs in a local browser Worker. The runtime and tokenizer are served from this site's own origin. Model weights are read locally when available, or downloaded from the public model repository above and cached by the browser. No user text is included in network requests.
