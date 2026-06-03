<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    sessionStorage.setItem('hasSeenSplash', 'true')
    router.replace('/')
  }, 3000)
})
</script>

<template>
  <div class="font-body min-h-screen antialiased flex flex-col items-center justify-between relative overflow-hidden py-12" style="background-color: var(--color-background); color: var(--color-on-background);">
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed opacity-30 blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none"></div>

    <div class="flex-1"></div>

    <main class="flex flex-col items-center justify-center w-full max-w-md px-6 z-10 flex-none">
      <div class="flex flex-col items-center">
        <div class="w-32 h-32 md:w-40 md:h-40 mb-12 relative drop-shadow-sm splash-logo">
          <div class="w-full h-full">
            <img alt="薯鲜生 Official Logo" class="w-full h-full object-contain" src="/logo.png" />
          </div>
        </div>
        <h1 class="font-headline text-headline-md font-bold text-primary tracking-tight mb-4 sr-only">薯鲜生</h1>
        <h2 class="font-headline text-2xl md:text-3xl text-on-surface font-medium tracking-wide text-center splash-slogan">
          寻味大地，遇见纯粹
        </h2>
        <div class="h-px bg-primary/30 mt-8 mx-auto splash-divider"></div>
      </div>
    </main>

    <div class="flex-1 flex flex-col justify-end w-full pb-8 z-10">
      <footer class="w-full text-center px-6 splash-footer">
        <p class="font-label text-xs md:text-sm text-outline tracking-[0.2em] uppercase">
          POWERED BY SAHARA HARVEST
        </p>
      </footer>
    </div>
  </div>
</template>
