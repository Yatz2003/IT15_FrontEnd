function SectionPage({ title, description }) {
  return (
    <section className="section-page container-fluid py-4 px-3 px-md-4">
      <h1 className="h3 fw-bold mb-2">{title}</h1>
      <p className="text-muted mb-0">{description}</p>
    </section>
  );
}

export default SectionPage;
