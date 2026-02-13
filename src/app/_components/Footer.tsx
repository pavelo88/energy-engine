export default function Footer() {
    return (
        <footer className="border-t border-primary/20 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-8">
                <p className="text-sm text-foreground/60">&copy; 2024 Energy Engine España. Todos los derechos reservados.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a className="text-sm transition-colors hover:text-primary text-foreground/60" href="#">Términos</a>
                    <a className="text-sm transition-colors hover:text-primary text-foreground/60" href="#">Privacidad</a>
                </div>
            </div>
        </footer>
    );
}
