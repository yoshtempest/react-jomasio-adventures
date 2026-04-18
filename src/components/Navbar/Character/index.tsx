import styles from "./styles.module.css";

export function Character() {

  const characters = [
    { name: "Marcelo", image: "marcelo" },
    { name: "Eduarda", image: "eduarda" },
    { name: "Samuel", image: "samuel" },
    { name: "Artur", image: "artur" },
    { name: "Emanuel", image: "emanuel" },
    { name: "Larissa", image: "larissa" },
    { name: "Mayra", image: "mayra" },
    { name: "Camilly", image: "camilly" },
    { name: "Lucas", image: "lucas" },
    { name: "Lucaua", image: "lucaua" },
    { name: "Riquelme", image: "riquelme" },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.characterTitle}>Personagem</h3>

      <div className={styles.charactersContainer}>
        {characters.map((char) => (
          <div key={char.name} className={styles.character}>
            <img
              src={`/src/assets/player/${char.image}/default.svg`}
              className={styles.characterImage}
            />
            <h2>{char.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}