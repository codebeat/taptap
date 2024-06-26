function Error500() {
  function handleReload() {
    window.location.reload();
  }
  return (
    <main className="text-center">
      <h1 className="text-[85px] font-semibold text-white">500</h1>
      <h1 className="text-[34px] text-white">Internal Server error</h1>
      <button
        onClick={handleReload}
        className="bg-blue-800 text-white p-3 rounded-md text-[18px] font-sfSemi mt-4"
      >
        Reload
      </button>
    </main>
  );
}

export default Error500;
