"use client";

export default function Cta() {
    return (
        <section
            className="cta d-flex align-items-end"
            style={{
                backgroundImage: "url('/assets/admin/cta.webp')",
                backgroundSize: "contain",
                backgroundColor: 'white',
                backgroundPosition: "center",
                backgroundRepeat: 'no-repeat',
                height: "300px",
                position: "relative",
                overflow: "hidden",
                padding: "2rem",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "8%",
                    transform: "translateY(-50%)",
                }}
            >
                <button className="btn btn-danger px-4 py-2" style={{ borderRadius: '5px' }}>
                    Buy Now
                </button>
            </div>
        </section>
    );
}