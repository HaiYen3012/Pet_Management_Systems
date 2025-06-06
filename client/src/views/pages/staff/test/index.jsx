import useAuth from "hooks/useAuth"

export default function PetManager () {
    const { logout } = useAuth();
    const handleLogout = () => {
        logout()
    }
    return (
        <>
            Có vẻ thành công rồi
            <button style={{border: 'solid 1px #000'}} onClick={handleLogout}> cook ra ngoài </button>
            
        </>
    )
}