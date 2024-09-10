import ButtonBlue from "../../components/ButtonBlue"

const PreferenceTitle = ({ title, onClick, titleButton, color = "blue" }) => {
    return (
        <div className="preference-title">
            <h4>{title}</h4>
            {onClick && (
                <ButtonBlue
                    color={color}
                    title={titleButton || "Agregar Nuevo"}
                    onClick={onClick}
                    addButtonTitle={onClick}
                />
            )}
        </div>
    )
}

export default PreferenceTitle