## FAQ
1. **Q:** How much vram would you recommend to run this locally?

   **A:** The system requires approximately 36GB VRAM, with 15-17GB for the LLM Server, 7GB for the TTS Server, and 11GB for the stable diffusion webui.
2. **Q:** Why cherry refuses but still send pictures?

   **A:** Sending pictures depends on your message, and for now we won't consider Cherry's opinion. So what you see is her rejecting your request, but you will still receive the photos. Next version, send picture will base on cherry's opition. Once Cherry says no, you will not get the picture. This will make her like human more.
3. **Q:** How do we set it up on a server and make it run 24/7 ? 

   **A:** I will write a deployment guide for the project. 

4. **Q:** Can I run multiple parts of the system across multiple devices? (LLM server in one device, TTS in another and stable diffusion in a web server) is that possible? 

   **A:** Yes you can run multiple parts of the system across multiple devices. Right now I have a A5000 for LLM & TTS,  a 3090 for stable diffusion 

5. **Q:** Can I connect my existing stable diffusion with this? Or require a dedicated instance?

   **A:** Yes, you can use the exsiting stable diffusion, just make sure to add `--api` to the args.