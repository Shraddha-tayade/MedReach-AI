function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">

      <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {title}
      </h3>

      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;