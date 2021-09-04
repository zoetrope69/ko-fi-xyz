import getContrastRatio from "get-contrast-ratio";

export default function ColourContrastInfo({
  firstColor,
  secondColor,
}) {
  if (!firstColor || !secondColor) {
    return null;
  }

  const colorContrastRatio = getContrastRatio(
    firstColor,
    secondColor
  );

  //   const passes
  const passesWCAGAA = colorContrastRatio >= 4.5;
  const passesWCAGAAA = colorContrastRatio >= 7;

  return (
    <div className="ColourContrastInfo">
      {!passesWCAGAA && (
        <>
          <p>
            The colours you picked may make it{" "}
            <a href="https://accessibility.blog.gov.uk/2016/06/17/colour-contrast-why-does-it-matter/">
              hard for some people to read
            </a>
            .
          </p>
          <p>Make the colour contrast ratio above 4.5 at minimum.</p>
        </>
      )}
      {passesWCAGAAA && <p>Lovely colours that. ✨</p>}
      <small className="ColourContrastInfoRatio">
        <a href="https://webaim.org/articles/contrast/">
          WCAG Colour Contrast Ratio
        </a>
        : {colorContrastRatio}:1
      </small>
    </div>
  );
}
