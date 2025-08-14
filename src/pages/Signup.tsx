import SignupForm from "@/components/molecules/SignupForm";

const Signup = () => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Blurred, lighter gradient background overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 30%, #6ee7b7 40%, #a7f3d0 70%, #21943c 100%)',
          filter: 'blur(32px)',
          opacity: 0.7,
        }}
      />
      <div style={{
        background: '#21943c',
        boxShadow: '0 8px 48px 0 rgba(0,0,0,0.45)',
        borderRadius: '16px',
        maxWidth: '500px',
        width: '100%',
        minHeight: '620px',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        padding: '2.5rem 2.5rem 1.5rem 2.5rem',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup; 