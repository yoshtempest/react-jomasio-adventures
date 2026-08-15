ffmpeg -i public/assets/videos/denisburn.mp4 -vf "chromakey=0x00ff00:0.25:0.1,format=yuva420p" -c:v libvpx-vp9 -b:v 0 -crf 30 public/assets/videos/denisburn.webm

ao invés de denisburn, basta colocar o nome correto nos 2 lugares

videos .webm não tem fundo e poderão ser utilizados como animação