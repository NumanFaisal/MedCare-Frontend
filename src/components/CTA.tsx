import { Button } from "./ui/button";

function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-primary to-[#0A6EFF] rounded-2xl py-16 px-8 text-center text-white shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Better Healthcare?
            </h2>

            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Join MedCare today and become part of a healthcare ecosystem that
              puts compassion, connectivity, and accessibility first. Together,
              we're building a healthier tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white text-primary hover:bg-gray-100 text-lg py-6 px-8 rounded-lg">
                Get Started Now
              </Button>

              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/20 text-lg py-6 px-8 rounded-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
