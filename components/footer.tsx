import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-white mt-auto">
      <div className="border-t border-neutral-200 py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/capyvara-logo.jpg"
                alt="Ícone do ORIENTA"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-semibold text-neutral-700">CAPYVARA</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/facepe-logo.png"
                alt="Ícone do ORIENTA"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-semibold text-neutral-700">FACEPE</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/logo-orienta.jpeg"
                alt="Ícone do ORIENTA"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-semibold text-neutral-700">ORIENTA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#1e237e] py-2 px-4">
        <div className="container mx-auto max-w-6xl">
          <p className="text-xs text-white text-center">ORIENTA 2025 - TODOS OS DIREITOS RESERVADOS</p>
        </div>
      </div>
    </footer>
  )
}
