import Button from '../components/Button';

function NotFound() {
  return (
    <section className="py-24">
      <div className="max-w-[520px] mx-auto px-8 text-center">
        <div className="text-[13px] text-brick font-semibold mb-2.5">404</div>
        <h1 className="text-[26px] sm:text-[34px] font-display font-semibold mb-3">
          Səhifə tapılmadı
        </h1>
        <p className="text-muted mb-8">
          Axtardığınız səhifə mövcud deyil və ya silinib.
        </p>
        <Button to="/" variant="primary">
          Ana səhifəyə qayıt
        </Button>
      </div>
    </section>
  );
}

export default NotFound;
